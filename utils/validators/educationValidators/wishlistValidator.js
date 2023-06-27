const { body } = require("express-validator");
const Course = require("../../../models/educationModel/educationCourseModel");
const ApiError = require("../../apiError");
const validatorMiddleware = require("../../../middlewares/validatorMiddleware");

exports.addCourseToWishlistValidator = [
  body("courseId")
    .notEmpty()
    .withMessage("Product required")
    .isMongoId()
    .withMessage("Invalid ID format")
    .custom((courseId) =>
      Course.findById(courseId).then((course) => {
        if (!course) {
          return Promise.reject(new ApiError("Course Not Found", 404));
        }
      })
    ),
  validatorMiddleware,
];
