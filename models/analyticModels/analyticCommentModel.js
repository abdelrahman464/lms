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
      image: String,
      repiles: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
          },
          content: String,
        },
      ],
    },
    { timestamps: true }
  );

  // ^find => it mean if part of of teh word contains find
  analyticCommentSchema.pre(/^find/, function (next) {
    // this => query
    this.populate({ path: "user", select: "name profileImg" });
    this.populate({ path: "repiles.user", select: "name profileImg" });
    next();
  });

  const setImageURL = (doc) => {
    //return image base url + iamge name
    if (doc.image) {
      const imageUrl = `${process.env.BASE_URL}/analytic/commentPost/${doc.image}`;
      doc.image = imageUrl;
    }
  };
  //after initializ the doc in db
  // check if the document contains image
  // it work with findOne,findAll,update
  analyticCommentSchema.post("init", (doc) => {
    setImageURL(doc);
  });
  // it work with create
  analyticCommentSchema.post("save", (doc) => {
    setImageURL(doc);
  });
  const Comment = mongoose.model("AnalyticComment", analyticCommentSchema);
  module.exports = Comment;
