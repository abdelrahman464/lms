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
      enum: ["Home_Post", "course"],
      default: "Home_Post",
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EducationCourse",
    },
    image: String,
  },
  { timestamps: true }
);

// ^find => it mean if part of of teh word contains find
analyticPostSchema.pre(/^find/, function (next) {
  // this => query
  this.populate({ path: "user", select: "name profileImg" });
  this.populate({ path: "course", select: "title" });
  next();
});

analyticPostSchema.pre("remove", async function (next) {
  //delete comments reated with post
  await Comment.deleteMany({ post: this._id }); // worked
  //delete reacts reated with post
  await Reaction.deleteMany({ postId: this._id });
  next();
});

const setImageURL = (doc) => {
  //return image base url + iamge name
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/analytic/posts/${doc.image}`;
    doc.image = imageUrl;
  }
};




//after initializ the doc in db
// check if the document contains image
// it work with findOne,findAll,update
analyticPostSchema.post("init", (doc) => {
  setImageURL(doc);
});
// it work with create
analyticPostSchema.post("save", (doc) => {
  setImageURL(doc);
});
const Post = mongoose.model("AnalyticPost", analyticPostSchema);
module.exports = Post;
