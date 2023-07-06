const stripe = require("stripe")(
  ""
);
const asyncHandler = require("express-async-handler");
const ApiError = require("../../utils/apiError");
const factory = require("./handllerFactory");

const Order = require("../../models/educationModel/educationOrderModel");
const Cart = require("../../models/educationModel/educationCartModel");
const Course = require("../../models/educationModel/educationCourseModel");
const User = require("../../models/userModel");
const sendEmail = require("../../utils/sendEmail");

exports.filterOrderForLoggedUser = asyncHandler(async (req, res, next) => {
  if (req.user.role === "user") req.filterObj = { user: req.user._id };
  next();
});
//@desc get all orders
//@route GET /api/v1/orders
//@access protected/user-admin-manager
exports.findAllOrders = factory.getALl(Order);
//@desc get specifi orders
//@route GET /api/v1/orders/:orderId
//@access protected/user-admin-manager
exports.findSpecificOrder = factory.getOne(Order);
//@desc Get checkout session from stripe and send it as response
//@route GET /api/v1/orders/checkout-session/cartId
//@access protected/user
exports.checkoutSession = asyncHandler(async (req, res, next) => {
  const { cartId } = req.params;
  //app settings
  const taxPrice = 0;
  //1) get cart depend on catrId
  const cart = await Cart.findById(cartId);
  if (!cart) {
    return next(new ApiError("There's Not Courses In you Cart", 404));
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
          currency: "egp",
          product_data: {
            name: req.user.name,
          },
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/api/v1/education`,
    cancel_url: `${req.protocol}://${req.get("host")}/api/v1/education/cart`,
    customer_email: req.user.email,


    client_reference_id: req.params.cartId, // i will use to create order
  });

  //4) send session to response
  res.status(200).json({ status: "success", session });
});

const createCardOrder = async (session) => {
  const cartId = session.client_reference_id;
  const orderPrice = session.amount_total / 100;

  const cart = await Cart.findById(cartId);
  const user = await User.findOne({ email: session.customer_email });

  //3)create order with default payment method cash
  const order = await Order.create({
    user: user._id,
    cartItems: cart.cartItems,
    totalOrderPrice: orderPrice,
    isPaid: true,
    paidAt: Date.now(),
    paymentMethodType: "card",
  });
  //4) after creating order increment course sold
  if (order) {
    const bulkOptions = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.course },
        update: { $inc: { sold: +1 } },
      },
    }));
    await Course.bulkWrite(bulkOptions, {});

    //5) adding the course to user
    user.courses.push(cart.cartItems.course._id);
    await user.save();
    //6)clear cart depend on cartId
    await Cart.findByIdAndDelete(cartId);

    const emailMessage = `Hi ${user.name},\n Your order has been created successfully \n 
                          the course added to your account successfully\n
                          the order Price is : { ${orderPrice} } `;
    //7-send the reset code via email
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