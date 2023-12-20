const { check } = require("express-validator");
const validatorMiddleware = require("../../../middlewares/validatorMiddleware");
const ApiError = require("../../apiError");

exports.checkIdValidator = [
  check("id").isMongoId().withMessage("Invalid Review id format"),
  validatorMiddleware,
];
//--------------------------------------------------------
exports.checkStatusValidator = [
  check("status")
    .isIn(["pending", "paid", "inpaid"])
    .withMessage("incorrect status"),
  validatorMiddleware,
];
