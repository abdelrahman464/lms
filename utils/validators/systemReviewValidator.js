const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.createReviewValidator = [
  check("ratingsAverage")
    .notEmpty()
    .withMessage("Ratings average is required")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Ratings average must be between 1 and 5"),
  check("opinion").notEmpty().withMessage("Opinion is required"),

  validatorMiddleware,
];

exports.checkIdValidator = [
  check("id").isMongoId().withMessage("Invalid Review id format"),
  validatorMiddleware,
];
