const mongoose = require("mongoose");

const systemReviewsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  ratingsAverage: {
    type: Number,
    min: [1, "rating must be between 1.0 and 5.0"],
    max: [5, "rating must be between 1.0 and 5.0"],
  },
  opinion: {
    type: String,
    required: true,
  }, 
});

systemReviewsSchema.pre(/^find/, function (next) {
  // this => query
  this.populate({ path: "user", select: "name email profileImg" });
  next();
});

const SystemReview = mongoose.model("systemReviews", systemReviewsSchema);

module.exports = SystemReview;
