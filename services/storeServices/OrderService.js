const stripe = require("stripe")(
  ""
);
const asyncHandler = require("express-async-handler");
const ApiError = require("../../utils/apiError");
const factory = require("../handllerFactory");

const OrderStore = require("../../models/storeModels/storeOrderModel");
const CartStore = require("../../models/storeModels/storeCartModel");
const User = require("../../models/userModel");
const Product = require("../../models/storeModels/storeProductModel");
const sendEmail = require("../../utils/sendEmail");

//@desc create cash order
//@route POST /api/v1/orders/store/:cartId
//@access protected/user
exports.createCashOrder = asyncHandler(async (req, res, next) => {
  const { cartId } = req.params;
  //app settings
  const taxPrice = 0;
  const shippingPrice = 0;
  //1) get cart depend on catrId
  const cart = await CartStore.findById(cartId);
  if (!cart) {
    return next(
      new ApiError(`Cart Not Found`, 404)
    );
  }
  //2) get order price cart price  "check if copoun applied"
  const cartPrice = cart.totalCartpriceAfterDiscount
    ? cart.totalCartpriceAfterDiscount
    : cart.totalCartprice;
  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;
  //3)create order with default payment method cash
  const order = await OrderStore.create({
    user: req.user._id,
    cartItems: cart.cartItems,
    shippingAddress: req.body.shippingAddress,
    totalOrderPrice,
  });
  //4) after creating order  decerement product quantity and increment product sold
  if (order) {
    const bulkOptions = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await Product.bulkWrite(bulkOptions, {});
    //5)clear cart depend on cartId
    await CartStore.findByIdAndDelete(cartId);

    const userOrder = await User.findById(req.user._id);
    const emailMessage = `Hi ${userOrder.name},\n Your order has been created successfully \n 
    you have to wait for 2 days at least before the order arrives to you \n
    the order Price is : { ${totalOrderPrice} } containing the order cartPrice :${cartPrice}
    and order shipping price : ${shippingPrice} 
    and order tax price : ${taxPrice}`;
    //3-send the reset code via email
    await sendEmail({
      to: userOrder.email,
      subject: "Your Order has been created successfully",
      text: emailMessage,
    });
  }
  res.status(201).json({ status: "success", data: order });
});

exports.filterOrderForLoggedUser = asyncHandler(async (req, res, next) => {
  if (req.user.role === "user") req.filterObj = { user: req.user._id };
  next();
});
//@desc get all orders
//@route GET /api/v1/orders
//@access protected/user-admin-manager
exports.findAllOrders = factory.getALl(OrderStore);
//@desc get specifi orders
//@route GET /api/v1/orders/:orderId
//@access protected/user-admin-manager
exports.findSpecificOrder = factory.getOne(OrderStore);
//@desc update order paid status to paid
//@route PUT /api/v1/orders/:orderId/pay
//@access protected/admin-manager
exports.updateOrderToPay = asyncHandler(async (req, res, next) => {
  const order = await OrderStore.findById(req.params.id);
  if (!order) {
    return next(
      new ApiError(`there is no such a order for this id ${req.params.id}`, 404)
    );
  }
  //update order to payed
  order.isPaid = true;
  order.paidAt = Date.now();

  const updatedOrder = await order.save();

  res.status(200).json({ status: "success", data: updatedOrder });
});
//@desc update order delivered status to delivered
//@route PUT /api/v1/orders/:orderId/deliver
//@access protected/admin-manager
exports.updateOrderToDelivered = asyncHandler(async (req, res, next) => {
  const order = await OrderStore.findById(req.params.id);
  if (!order) {
    return next(
      new ApiError(`there is no such a order for this id ${req.params.id}`, 404)
    );
  }
  //update order to payed
  order.isDelivered = true;
  order.deliveredAt = Date.now();

  const updatedOrder = await order.save();

  res.status(200).json({ status: "success", data: updatedOrder });
});
//@desc Get checkout session from stripe and send it as response
//@route GET /api/v1/orders/checkout-session/cartId
//@access protected/user
exports.checkoutSession = asyncHandler(async (req, res, next) => {
  const { cartId } = req.params;
  //app settings
  const taxPrice = 0;
  const shippingPrice = 0;
  //1) get cart depend on catrId
  const cart = await CartStore.findById(cartId);
  if (!cart) {
    return next(
      new ApiError(`there is no cart with id ${req.params.catrId}`, 404)
    );
  }
  //2) get order price cart price  "check if copoun applied"
  const cartPrice = cart.totalCartpriceAfterDiscount
    ? cart.totalCartpriceAfterDiscount
    : cart.totalCartprice;
  const totalOrderPrice = Math.ceil(cartPrice + taxPrice + shippingPrice);

  //3)create stripe checkout session
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          unit_amount: totalOrderPrice * 100,
          currency: "egp",
          product_data: {
            name: req.user.name,
          },
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/api/v1/store`,
    cancel_url: `${req.protocol}://${req.get("host")}/api/v1/store/cart`,
    customer_email: req.user.email,

    client_reference_id: req.params.cartId, // i will use to create order
    metadata: req.body.shippingAddress,
  });

  //4) send session to response
  res.status(200).json({ status: "success", session });
});

const createCardOrder = async (session) => {
  const cartId = session.client_reference_id;
  const shippingAddress = session.metadata;
  const orderPrice = session.amount_total / 100;

  const cart = await CartStore.findById(cartId);
  const user = await User.findOne({ email: session.customer_email });

  //3)create order with default payment method cash
  const order = await OrderStore.create({
    user: user._id,
    cartItems: cart.cartItems,
    shippingAddress,
    totalOrderPrice: orderPrice,
    isPaid: true,
    paidAt: Date.now(),
    paymentMethodType: "card",
  });
  //4) after creating order  decerement product quantity and increment product sold
  if (order) {
    const bulkOptions = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await Product.bulkWrite(bulkOptions, {});

    //5)clear cart depend on cartId
    await CartStore.findByIdAndDelete(cartId);

    const emailMessage = `Hi ${user.name},\n Your order has been created successfully \n 
    you have to wait for 2 days at least before the order arrives to you \n
    the order Price is : { ${orderPrice} } `;
    //3-send the reset code via email
    await sendEmail({
      to: session.customer_email,
      subject: "Your Order has been created successfully",
      text: emailMessage,
    });
  }
};

//@desc this webhook will run when the stripe payment success paied
//@route POST /webhook-checkout
//@access protected/user
exports.webhookCheckout = asyncHandler(async (req, res, next) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  if (event.type === "checkout.session.completed") {
    createCardOrder(event.data.object);
  }

  res.status(200).json({ received: true });
});
