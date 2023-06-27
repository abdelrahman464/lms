const { check } = require("express-validator");
const validatorMiddleware = require("../../../middlewares/validatorMiddleware");
const Post = require("../../../models/analyticModels/analyticPostModel");
const User = require("../../../models/userModel");

exports.processPostValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Requst id format")
    .custom((val, { req }) =>
      Post.findById(val).then((post) => {
        if (!post) {
          return Promise.reject(new Error(`Post not found`));
        }
        return User.findById(req.user._id).then((user) => {
          if (
            post.user._id.toString() !== user._id.toString() &&
            user.role === "admin"
          ) {
            return Promise.reject(
              new Error(`Your are not allowed to perform this action`)
            );
          }
        });
      })
    ),

  validatorMiddleware,
];
