const mongoose = require("mongoose");

const BrockerSchema = new mongoose.Schema(
  {
    country: String,
    title: String,
    link: String,
    videoLinks: [String],
    marketer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);
BrockerSchema.pre(/^find/, function (next) {
  // this => query
  this.populate({ path: "marketer", select: "name email profileImg" });
  next();
});
module.exports = mongoose.model("Brocker", BrockerSchema);
