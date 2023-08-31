const asyncHandler = require("express-async-handler");
const coinbase= require("coinbase-commerce-node");
const PackageOrder = require("../models/educationModel/educationOrderModel");
const Package = require("../models/educationModel/educationPackageModel");
const User = require("../models/userModel");
const OrderStore = require("../models/storeModels/storeOrderModel");
const CartStore = require("../models/storeModels/storeCartModel");
const Product = require("../models/storeModels/storeProductModel");



// hanlde both cart order and package order 
exports.webhookCoinBase = asyncHandler(async (req, res) => {

    const {Webhook}= coinbase;
   
    try {
      const event = Webhook.verifyEventBody(
        req.rawBody,
        req.headers["x-cc-webhook-signature"],
        process.env.COINBASE_WEBHOOK_SECRET
      );
     console.log(event.type)
      if(event.type==="charge:confirmed"){
        // eslint-disable-next-line no-use-before-define
        if(event.data.metadata.type === "education"){ 
            // eslint-disable-next-line no-use-before-define
            await createPackageOrder(event);
         } else if(event.data.metadata.type === "store"){
            // eslint-disable-next-line no-use-before-define
            await createCardOrder(event)
        }
        else{
            console.log("error happened :)");
            res.status(200).json({ status: "error happened" });
        }
        
    }
    res.status(200).json({ received: true });
  
    } catch (err) {
      res.status(400).send(`Webhook Error: ${err.message}`);
    }
  
  });
  
  //----------------------------------------------------------------------------
  const createPackageOrder = async (event) => {
    const {packageId}= event.data.metadata;
    const orderPrice = event.data.pricing.local.amount;
    //1)retrieve importsant objects
    const package = await Package.findById(packageId);
    const user = await User.findOne({ _id: event.data.metadata.user_id });
  
    if (!package) {
      return new Error("Package Not Found");
    }
    if (!user) {
      return new Error(" User Not Found");
    }
    //2)create order with default payment method cash
    const order = await PackageOrder.create({
      user: user._id,
      totalOrderPrice: orderPrice,
      isPaid: true,
      paymentMethodType:"coinBase",
      paidAt: Date.now(),
    });
  
    if (!order) {
      return new Error("Couldn't Create Order");
    }
  
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + package.expirationTime);
    // 2)Add the user object to the users array
    const newUser = {
      user: user._id,
      start_date: startDate,
      end_date: endDate,
    };
  
    package.users.addToSet(newUser);
  
    await package.save();
  };
//------------------------------------------------------------------------
const createCardOrder = async (event) => {
    const {cartId} = event.data.metadata;
    const orderPrice = event.data.pricing.local.amount;
  
    const cart = await CartStore.findById(cartId);
    const user = await User.findOne({ _id: event.data.metadata.userId });
  
    //3)create order with default payment method cash
    const order = await OrderStore.create({
      user: user._id,
      cartItems: cart.cartItems,
      totalOrderPrice: orderPrice,
      isPaid: true,
      paidAt: Date.now(),
      paymentMethodType: "coinBase",
    });
    //4) after creating order  decerement product quantity and increment product sold
    if (order) {
      const bulkOptions = cart.cartItems.map((item) => ({
        updateOne: {
          filter: { _id: item.product },
          update: { $inc: {  sold: +item.quantity } },
        },
      }));
      await Product.bulkWrite(bulkOptions, {});
  
      //5)clear cart depend on cartId
      await CartStore.findByIdAndDelete(cartId);
    }
  };
  