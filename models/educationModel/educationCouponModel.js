const mongoose = require("mongoose");

const educationCouponSchema = mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, "Coupon name required"],
      unique: true,
      uppercase: true,
    },
    expire: {
      type: Date,
      required: [true, "Coupon expire time required"],
    },
    discount: {
      type: Number,
      required: [true, "Coupon expire value required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("EducationCoupon", educationCouponSchema);
