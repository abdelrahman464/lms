const { check } = require("express-validator");
const validatorMiddleware = require("../../../middlewares/validatorMiddleware");
const Comment = require("../../../models/analyticModels/analyticCommentModel");
const User = require("../../../models/userModel");

exports.processCommentValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Requst id format")
    .custom((val, { req }) =>
      Comment.findById(val).then((com) => {
        if (!com) {
          return Promise.reject(new Error(`comment not found`));
        }
        return User.findById(req.user._id).then((user) => {
          if (user.role === "admin") {
            return true;
          }
          if (com.user._id.toString() !== user._id.toString()) {
            return Promise.reject(
              new Error(`Your are not allowed to perform this action`)
            );
          }
        });
      })
    ),

  validatorMiddleware,
];
