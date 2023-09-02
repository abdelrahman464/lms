const mongoose = require("mongoose");

const educationOrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "order must be belong to user"],
    },
    taxPrice: {
      type: Number,
      default: 0,
    },
    totalOrderPrice: {
      type: Number,
    },
    paymentMethodType: {
      type: String, 
    },
    coupon: {
      type: String, 
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: Date,
  },
  { timestamp: true }
);
educationOrderSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name phone email " })
  next();
});
module.exports = mongoose.model("EducationOrder", educationOrderSchema);
