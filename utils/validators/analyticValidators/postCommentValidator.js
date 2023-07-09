const { check } = require("express-validator");
const validatorMiddleware = require("../../../middlewares/validatorMiddleware");
const ApiError = require("../../apiError");
const Comment = require("../../../models/analyticModels/analyticCommentModel");
const Post = require("../../../models/analyticModels/analyticPostModel");

exports.createCommentValidator = [
  check("post")
    .isMongoId()
    .withMessage("Invalid Requst id format")
    .custom(async (val, { req, res, next }) => {
      const post = await Post.findById(val);
      if (!post) {
        return next(new ApiError(`Post not found`, 404));
      }
    }),

  validatorMiddleware,
];
exports.updateCommentValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Requst id format")
    .custom((val, { req }) =>
      Comment.findById(val).then((com) => {
        //check if comment exists
        if (!com) {
          return Promise.reject(new Error(`comment not found`));
        }
        if (com.user._id.toString() !== req.user._id.toString()) {
          return Promise.reject(
            new Error(`Your are not allowed to perform this action`)
          );
        }
      })
    ),

  validatorMiddleware,
];
exports.deleteCommentValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Requst id format")
    .custom((val, { req }) =>
      Comment.findById(val).then((com) => {
        //check if comment exists
        if (!com) {
          return Promise.reject(new Error(`comment not found`));
        }
        //check if user who created the comment or he is admin
        if (
          com.user._id.toString() !== req.user._id.toString() &&
          req.user.role !== "admin"
        ) {
          return Promise.reject(
            new Error(`Your are not allowed to perform this action`)
          );
        }
        return true;
      })
    ),

  validatorMiddleware,
];
