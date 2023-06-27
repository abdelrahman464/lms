const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  sold: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, "Package price is required"],
    trim: true,
    max: [200000, "Too long Package price"],
  },
  priceAfterDiscount: {
    type: Number,
  },
  image: {
    type: String,
    required: [true, "package image is required"],
  },
  courses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
});

const Package = mongoose.model("Package", packageSchema);

module.exports = Package;
