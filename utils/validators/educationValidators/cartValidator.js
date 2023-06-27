const { check } = require("express-validator");
const validatorMiddleware = require("../../../middlewares/validatorMiddleware");
const Course = require("../../../models/educationModel/educationCourseModel");

exports.addCourseToCartValidator = [
  check("courseId")
    .notEmpty()
    .withMessage("Product id is required")
    .isMongoId()
    .withMessage("Invalid ID format")
    .custom((courseId) =>
      Course.findById(courseId).then((course) => {
        if (!course) {
          return Promise.reject(new Error("Course Not Found"));
        }
      })
    ),

  validatorMiddleware,
];

exports.removeSpecificCartItemValidator = [
  check("itemId").isMongoId().withMessage("Invalid ID format"),
  validatorMiddleware,
];

exports.applayCouponValidator = [
  check("coupon").notEmpty().withMessage("coupon is required"),
  validatorMiddleware,
];
