const mongoose = require("mongoose");

const analyticCommentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AnalyticPost",
      required: true,
    },
  },
  { timestamps: true }
);

// ^find => it mean if part of of teh word contains find
analyticCommentSchema.pre(/^find/, function (next) {
  // this => query
  this.populate({ path: "user", select: "name " });
  next();
});
const Comment = mongoose.model("AnalyticComment", analyticCommentSchema);
module.exports = Comment;
