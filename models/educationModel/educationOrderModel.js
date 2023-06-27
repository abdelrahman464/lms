const mongoose = require("mongoose");

const educationOrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "order must be belong to user"],
    },
    cartItems: [
      {
        course: {
          type: mongoose.Schema.ObjectId,
          ref: "EducationCourse",
        },
        price: Number,
      },
    ],
    taxPrice: {
      type: Number,
      default: 0,
    },
    totalOrderPrice: {
      type: Number,
    },
    paymentMethodType: {
      type: String,
      enum: ["card"],
      default: "card",
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
  this.populate({ path: "user", select: "name phone email " }).populate({
    path: "cartItems.course",
    select: "title image category",
  });
  next();
});

module.exports = mongoose.model("EducationOrder", educationOrderSchema);
