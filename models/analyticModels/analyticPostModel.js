const mongoose = require("mongoose");

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
    reactions: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        type: {
          type: String,
          enum: ["like", "love", "haha"],
          required: true,
        },
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AnalyticComment",
      },
    ],
  },
  { timestamps: true }
);

// ^find => it mean if part of of teh word contains find
analyticPostSchema.pre(/^find/, function (next) {
  // this => query
  this.populate({
    path: "user",
    select: "name",
  });
  next();
});
const Post = mongoose.model("AnalyticPost", analyticPostSchema);
module.exports = Post;
