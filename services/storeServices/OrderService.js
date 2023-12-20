const stripe = require("stripe")(process.env.STRIPE_SECRET);
const asyncHandler = require("express-async-handler");
const coinbase = require("coinbase-commerce-node");
const ApiError = require("../../utils/apiError");
const factory = require("../handllerFactory");

const OrderStore = require("../../models/storeModels/storeOrderModel");
const CartStore = require("../../models/storeModels/storeCartModel");
const User = require("../../models/userModel");
const Product = require("../../models/storeModels/storeProductModel");
const { calculateProfits } = require("../marketing/marketingService");

exports.filterOrderForLoggedUser = asyncHandler(async (req, res, next) => {
  if (req.user.role === "user") req.filterObj = { user: req.user._id };
  if (req.user.role === "instructor") req.filterObj = { user: req.user._id };
  next();
});
//@desc get all orders
//@route GET /api/v1/orders
//@access protected/
exports.findAllOrders = factory.getALl(OrderStore);
//@desc get specifi orders
//@route GET /api/v1/orders/:orderId
//@access protected/
exports.findSpecificOrder = factory.getOne(OrderStore);

//@desc Get checkout session from stripe and send it as response
//@route GET /api/v1/orders/checkout-session/cartId
//@access protected/
exports.checkoutSession = asyncHandler(async (req, res, next) => {
  const { cartId } = req.params;
  //app settings
  const taxPrice = 0;

  //1) get cart depend on catrId
  const cart = await CartStore.findById(cartId);
  if (!cart || cart.cartItems.length === 0) {
    return next(new ApiError("There's No Cart", 404));
  }
  //2) get order price cart price  "check if copoun applied"
  const cartPrice = cart.totalCartpriceAfterDiscount
    ? cart.totalCartpriceAfterDiscount
    : cart.totalCartprice;
  const totalOrderPrice = Math.ceil(cartPrice + taxPrice);

  //3)create stripe checkout session
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          unit_amount: totalOrderPrice * 100,
          currency: "usd",
          product_data: {
            name: req.user.name,
          },
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `https://www.wealthmakers-fx.com/`,
    cancel_url: `https://www.wealthmakers-fx.com/cart`,
    customer_email: req.user.email,

    client_reference_id: req.params.cartId, // i will use to create order
    metadata: { type: "store" },
  });

  //4) send session to response
  res.status(200).json({ status: "success", session });
});

//creating and order
const createCardOrder = async (session) => {
  const cartId = session.client_reference_id;
  const orderPrice = session.amount_total / 100;

  const cart = await CartStore.findById(cartId);
  const user = await User.findOne({ email: session.customer_email });

  //3)create order with default payment method cash
  console.log("start to store order order");

  const order = await OrderStore.create({
    user: user._id,
    cartItems: cart.cartItems,
    totalOrderPrice: orderPrice,
    isPaid: true,
    paidAt: Date.now(),
    coupon: cart.coupon,
    paymentMethodType: "stripe",
  });
  //4) after creating order  decerement product quantity and increment product sold
  if (order) {
    const bulkOptions = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { sold: +item.quantity } },
      },
    }));
    await Product.bulkWrite(bulkOptions, {});
    console.log("7mos");
    //5)clear cart depend on cartId
    await CartStore.findByIdAndDelete(cartId);
  }
};

//@desc this webhook will run when the stripe payment success paied
//@route POST store/webhook-checkout
//@access protected/
exports.webhookCheckoutStore = asyncHandler(async (req, res, next) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    console.log("start to verify   order");
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET_STORE
    );
    console.log("finished  order");
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  if (event.data.object.metadata.type === "store") {
    switch (event.type) {
      case "checkout.session.completed":
        console.log("start to create order");

        await createCardOrder(event.data.object);

        await calculateProfits(
          event.data.object.customer_email,
          event.data.object.amount_total / 100
        );

        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  }
  res.status(200).json({ received: true });
});
//-------------------------------------------------------------------------------------------------
exports.checkoutStoreCoinBase = asyncHandler(async (req, res, next) => {
  const { cartId } = req.params;
  //app settings
  const taxPrice = 0;

  //1) get cart depend on catrId
  const cart = await CartStore.findById(cartId);
  if (!cart || cart.cartItems.length === 0) {
    return next(new ApiError("There's No Cart", 404));
  }
  //2) get order price cart price  "check if copoun applied"
  const cartPrice = cart.totalCartpriceAfterDiscount
    ? cart.totalCartpriceAfterDiscount
    : cart.totalCartprice;
  const totalOrderPrice = Math.ceil(cartPrice + taxPrice);

  //3)- create coin base session
  const { Client } = coinbase;
  const { resources } = coinbase;
  try {
    Client.init(process.env.COINBASE_API_KEY);

    const session = await resources.Charge.create({
      name: "purchaseing order",
      description: "have a nice payment",
      local_price: {
        amount: totalOrderPrice,
        currency: "USD",
      },
      pricing_type: "fixed_price",
      metadata: {
        type: "store",
        user_id: req.user._id,
        userEmail: req.user.email,
        cartId: cartId,
      },
    });
    //4) send session to response
    res.status(200).json({ status: "success", session });
  } catch (error) {
    res.status(400).json({ error: error });
  }
});
