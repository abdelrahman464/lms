const mongoose = require("mongoose");

const educationPackageSchema = new mongoose.Schema({
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
  expirationTime: { //0  //30   //  //expirtaioInDays
    type: Number,
    required: [true, "expirationTime required"],
  },
  image: {
    type: String,
    required: [true, "package image is required"],
  },
  courses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EducationCourse",
    },
  ],
  users: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      start_date: {
        type: Date,
        required: true,
      },
      end_date: {
        type: Date,
        required: true,
      },
    },
  ],
});

const Package = mongoose.model("EducationPackage", educationPackageSchema);

module.exports = Package;
