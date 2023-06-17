const { check, body } = require("express-validator");
const validatorMiddleware = require("../../../middlewares/validatorMiddleware");

exports.addAddressValidator = [
  body("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number only accepted Egy and SA Phone numbers"),
  check("alias").notEmpty().withMessage("alias required"),
  check("details").notEmpty().withMessage("details required"),
  check("phone").notEmpty().withMessage("phone required"),
  check("city").notEmpty().withMessage("city required"),
  check("postalCode").notEmpty().withMessage("postalCode required"),
  validatorMiddleware,
];
