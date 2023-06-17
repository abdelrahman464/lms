const { check, body } = require("express-validator");
const slugify = require("slugify");
const validatorMiddleware = require("../../../middlewares/validatorMiddleware");

exports.getBrandValidator = [
  //rules
  check("id").isMongoId().withMessage("Invalid brand id format"),
  //catch error
  validatorMiddleware,
];
exports.createBrandValidator = [
  check("name")
    .notEmpty()
    .withMessage("brand required")
    .isLength({ min: 2 })
    .withMessage("too short brand name")
    .isLength({ max: 32 })
    .withMessage("too long brand name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  validatorMiddleware,
];
exports.updateBrandValidator = [
  check("id").isMongoId().withMessage("Invalid brand id format"),
  body("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];
exports.deleteBrandValidator = [
  check("id").isMongoId().withMessage("Invalid brand id format"),
  validatorMiddleware,
];
