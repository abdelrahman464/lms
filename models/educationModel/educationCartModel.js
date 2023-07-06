const mongoose = require("mongoose");

const educationCartSchema = mongoose.Schema(
  {
    cartItems: [
      {
        course: {
          type: mongoose.Schema.ObjectId,
          ref: "EducationCourse",
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
educationCartSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name -_id",
  });
  this.populate({
    path: "cartItems.course",
    populate: "title",
  });
  next();
});

module.exports = mongoose.model("EducationCart", educationCartSchema);