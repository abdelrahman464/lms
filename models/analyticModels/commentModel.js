const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
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
      ref: "Post",
      required: true,
    },
  },
  { timestamps: true }
);

// ^find => it mean if part of of teh word contains find
commentSchema.pre(/^find/, function (next) {
  // this => query
  this.populate({
    path: "user",
    select: "name",
  });
  next();
});
const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
