const { check } = require("express-validator");
const validatorMiddleware = require("../../../middlewares/validatorMiddleware");

exports.BrockerIdCheckerValidator = [
  check("id").isMongoId().withMessage("Invalid Brocker id format"),
  validatorMiddleware,
];
exports.createBrockerValidator = [
  check("title")
    .notEmpty()
    .withMessage("Brocker required")
    .isLength({ min: 3 })
    .withMessage("too short Brocker name")
    .isLength({ max: 99 })
    .withMessage("too long Brocker name"),
  check("country").notEmpty().withMessage("country required"),
  check("link").notEmpty().withMessage("Brocker link required"),
  check("videoLinks")
    .notEmpty()
    .withMessage("Brocker required")
    .isArray()
    .withMessage("Brocker video Links should be array of string"),
  validatorMiddleware,
];
exports.updateBrockerValidator = [
  check("id").isMongoId().withMessage("Invalid Brocker id format"),
  check("title")
    .optional()
    .isLength({ min: 3 })
    .withMessage("too short Brocker name")
    .isLength({ max: 99 })
    .withMessage("too long Brocker name"),
  check("country").optional(),
  check("link").optional(),
  check("videoLinks")
    .optional()
    .isArray()
    .withMessage("Brocker video Links should be array of string"),
  validatorMiddleware,
];
