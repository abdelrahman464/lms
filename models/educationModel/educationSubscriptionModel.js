const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const educationSubscriptionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  subscriptionCode: {
    type: String,
    required: true,
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  priceAfterDiscount: {
    type: Number,
  },
});
educationSubscriptionSchema.pre("save", async function (next) {
  //if subscriptionCode field is not modified go to next middleware
  if (!this.isModified("subscriptionCode")) return next();
  // Hashing user password
  this.subscriptionCode = await bcrypt.hash(this.subscriptionCode, 12);
  next();
});
const Subscription = mongoose.model("EducationSubscription", educationSubscriptionSchema);

module.exports = Subscription;
