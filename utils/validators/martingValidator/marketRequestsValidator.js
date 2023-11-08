const { check } = require("express-validator");
const validatorMiddleware = require("../../../middlewares/validatorMiddleware");
const ApiError = require("../../apiError");

exports.createmarketingReqValidator = [
  check("fullName")
    .isLength({ min: 2 })
    .withMessage("must be at least 2 chars")
    .notEmpty()
    .withMessage("fullName required"),
  check("country")
    .isLength({ min: 2 })
    .withMessage("must be at least 2 chars")
    .notEmpty()
    .withMessage("country required"),
  check("city")
    .isLength({ min: 2 })
    .withMessage("must be at least 2 chars")
    .notEmpty()
    .withMessage("city required"),

  check("birthDate")
    .notEmpty()
    .withMessage("birthDate is required")
    .isDate()
    .withMessage("invalid birthDate"),
  check("currentWork")
    .isLength({ min: 5, max: 150 })
    .withMessage("currentWork must be between 5 and 150 characters")
    .notEmpty()
    .withMessage("currentWork is required")
    .isString()
    .withMessage("invalid currentWork"),
  check("ansOfQuestion")
    .isLength({ min: 50, max: 1000 })
    .withMessage("ansOfQuestion must be between 50 and 1000 characters")
    .notEmpty()
    .withMessage("ansOfQuestion is required")
    .isString()
    .withMessage("invalid ansOfQuestion"),
  check("facebook")
    .notEmpty()
    .withMessage("facebook URL is required")
    .isURL()
    .withMessage("invalid facebook URL"),
  check("instgram")
    .notEmpty()
    .withMessage("instagram URL is required")
    .isURL()
    .withMessage("invalid instagram URL"),
  check("tiktok")
    .notEmpty()
    .withMessage("tiktok URL is required")
    .isURL()
    .withMessage("invalid tiktok URL"),
  check("telegram")
    .notEmpty()
    .withMessage("telegram URL is required")
    .isURL()
    .withMessage("invalid telegram URL"),
  check("identity").custom((value, { req }) => {
    if (!req.files) {
      throw new Error("Identity file is required");
    }
    const file = req.files.identity;
    if (!file.mimetype.startsWith("image") && !file.mimetype.includes("pdf")) {
      throw new ApiError("Identity must be an image or PDF file");
    }
    return true;
  }),
  check("paymentMethod")
    .notEmpty()
    .withMessage("paymentMethod is required")
    .isIn(["wise", "crypto"])
    .withMessage("invalid paymentMethod"),
 

  //catch error and return it as a response
  validatorMiddleware,
];
