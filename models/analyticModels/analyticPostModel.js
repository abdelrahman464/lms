const mongoose = require("mongoose");
const Comment = require("./analyticCommentModel");
const Reaction = require("./analyticReactionModel");

const analyticPostSchema = new mongoose.Schema(
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
    createdAt: {
      type: Date,
      default: Date.now,
    },
    sharedTo: {
      type: String,
      enum: ["public", "course"],
      default: "public",
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EducationCourse",
    },
  },
  { timestamps: true }
);

// ^find => it mean if part of of teh word contains find
analyticPostSchema.pre(/^find/, function (next) {
  // this => query
  this.populate({ path: "user", select: "name" });
  next();
});

analyticPostSchema.pre("remove", async function (next) {
  //delete comments reated with post
  await Comment.deleteMany({ post: this._id }); // worked
  //delete reacts reated with post
  await Reaction.deleteMany({ postId: this._id });
  next();
});
const Post = mongoose.model("AnalyticPost", analyticPostSchema);
module.exports = Post;
