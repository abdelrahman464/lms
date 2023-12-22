const mongoose = require("mongoose");

const BrockerSchema = new mongoose.Schema(
  {
    country: String,
    title: String,
    link: String,
    videoLinks: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Brocker", BrockerSchema);
