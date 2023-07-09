const { check } = require("express-validator");
const validatorMiddleware = require("../../../middlewares/validatorMiddleware");
const Post = require("../../../models/analyticModels/analyticPostModel");

exports.processPostValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Requst id format")
    .custom((val, { req }) =>
      Post.findById(val).then((post) => {
        if (!post) {
          return Promise.reject(new Error(`Post not found`));
        }
        console.log(post.user._id.toString());
        console.log(req.user._id.toString());
        if (
          post.user._id.toString() !== req.user._id.toString() &&
          req.user.role !== "admin"
        ) {
          return Promise.reject(
            new Error(`Your are not allowed to perform this action`)
          );
        }
      })
    ),

  validatorMiddleware,
];
