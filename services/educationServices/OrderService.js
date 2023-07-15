const stripe = require("stripe")(process.env.STRIPE_SECRET);
const asyncHandler = require("express-async-handler");
const ApiError = require("../../utils/apiError");
const factory = require("../handllerFactory");

const Order = require("../../models/educationModel/educationOrderModel");
const Package = require("../../models/educationModel/educationPackageModel");
const User = require("../../models/userModel");

exports.filterOrderForLoggedUser = asyncHandler(async (req, res, next) => {
  if (req.user.role === "user") req.filterObj = { user: req.user._id };
  if (req.user.role === "instructor") req.filterObj = { user: req.user._id };
  next();
});
//@desc get all orders
//@route GET /api/v1/orders
//@access protected
exports.findAllOrders = factory.getALl(Order);
//@desc get specifi orders
//@route GET /api/v1/orders/:orderId
//@access protected/
exports.findSpecificOrder = factory.getOne(Order);
//@desc Get checkout session from stripe and send it as response
//@route GET /api/v1/orders/checkout-session/cartId
//@access protected/user
exports.checkoutSession = asyncHandler(async (req, res, next) => {
  const { packageId } = req.params;
  //app settings
  const taxPrice = 0;

  //1) get cart depend on catrId
  const package = await Package.findById(packageId);
  if (!package) {
    return next(new ApiError("There's no package", 404));
  }
  //2) get order price cart price  "check if copoun applied"
  const packagePrice = package.priceAfterDiscount
    ? package.priceAfterDiscount
    : package.price;

  const totalOrderPrice = Math.ceil(packagePrice + taxPrice);

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
    success_url: `https://www.wealthmakers-fx.com`,
    cancel_url: `https://sdcbm.com`,
    customer_email: req.user.email,

    client_reference_id: req.params.packageId, // i will use to create order
  });

  //4) send session to response
  res.status(200).json({ status: "success", session });
});
//*-------------------------------------------------------------------------------------- */
const createCardOrder = async (session) => {
  const packageId = session.client_reference_id;
  const orderPrice = session.amount_total / 100;
  //1)retrieve importsant objects
  const package = await Package.findById(packageId);
  const user = await User.findOne({ email: session.customer_email });

  //2)create order with default payment method cash
  const order = await Order.create({
    user: user._id,
    totalOrderPrice: orderPrice,
    isPaid: true,
    paidAt: Date.now(),
    paymentMethodType: "card",
  });
  //3) after creating order assign user to plan & related info
  if (order) {
    //4) assign the user to plan 
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + package.expirationTime);
    // 2)Add the user object to the users array
    const newUser = ;
  
    package.users.push(newUser);
    
    
    await package.save();
  }
};

//@desc this webhook will run when the stripe payment success paied
//@route POST /webhook-checkout
//@access protected/user
exports.webhookCheckoutEducation = asyncHandler(async (req, res, next) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET_EDUCATION
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  if (event.type === "checkout.session.completed") {
    createCardOrder(event.data.object);
  }

  res.status(200).json({ received: true });
});
/*-----------------------------------------------------------------------------*/
// const addUserToPlan = async (package,userId) => {
//   //1)set time boundries
//   const startDate = new Date();
//   const endDate = new Date(startDate);
//   endDate.setDate(endDate.getDate() + package.expirationTime);
//   // 2)Add the user object to the users array
//   const newUser = {
//     user: userId ,
//     start_date: startDate,
//     end_date: endDate,
//   };

//   package.users.push(newUser);
//   package.sold += 1;
  
//   await package.save();
//   // return package ? true : false;
// };
