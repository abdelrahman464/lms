const mongoose = require("mongoose");

const cartSchema = mongoose.Schema(
  {
    cartItems: [
      {
        course: {
          type: mongoose.Schema.ObjectId,
          ref: "Course",
        },
        price: Number,
      },
    ],
    totalCartprice: Number,
    totalCartpriceAfterDiscount: Number,
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// ^find => it mean if part of of teh word contains find
cartSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "firstName -_id",
  });
  this.populate({
    path: "cartItems.course",
    populate: "title",
  });
  next();
});

module.exports = mongoose.model("Cart", cartSchema);
