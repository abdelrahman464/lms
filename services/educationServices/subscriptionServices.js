const asyncHandler = require("express-async-handler");
const Subscription = require("../../models/educationModel/educationSubscriptionModel");
const factory = require("../handllerFactory");
// Create a new subscription
exports.createSubscription = asyncHandler(async (req, res, next) => {
  const { description, title, price, priceAfterDiscount, endDate } = req.body;
  // Create a new section
  const subscription = new Subscription({
    title,
    description,
    price,
    priceAfterDiscount,
    startDate: new Date(),
    endDate,
    subscriptionCode:
      Math.floor(Math.random() * (99999999 - 10000000 + 1)) + 10000000,
  });

  await subscription.save();

  res.status(201).json({ success: true, subscription });
});
// Get all Subscriptions
exports.getAllSubscriptions = factory.getALl(Subscription);
// Get a specific Subscription by ID
exports.getSubscriptionById = factory.getOne(Subscription);
// Update a Subscription by ID
exports.updateSubscription = factory.updateOne(Subscription);
// Delete a Subscription by ID
exports.deleteSubscription = factory.deleteOne(Subscription);
