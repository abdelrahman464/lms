const { check, body } = require("express-validator");
const slugify = require("slugify");
const validatorMiddleware = require("../../../middlewares/validatorMiddleware");
const Category = require("../../../models/storeModels/storeCategoryModel");

exports.getsubCategoryValidator = [
  //rules
  check("id")
    .isMongoId()
    .withMessage("Invalid subCategory id format")
    .notEmpty()
    .withMessage("subCateogry must be belong to category"),
  //catch error
  validatorMiddleware,
];
exports.createSupCategroyValidator = [
  check("title")
    .notEmpty()
    .withMessage("subCategory required")
    .isLength({ min: 2 })
    .withMessage("too short subCategory name")
    .isLength({ max: 45 })
    .withMessage("too long subCategory name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("category")
    .notEmpty()
    .withMessage("subCateogry must be belong to category")
    .isMongoId()
    .withMessage("Invalid Category id format")
    .custom((categoryId) =>
      Category.findById(categoryId).then((cateogry) => {
        if (!cateogry) {
          return Promise.reject(
            new Error(`No Category for this id : ${categoryId}`)
          );
        }
      })
    ),

  validatorMiddleware,
];
exports.updateCategroyValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid subCategory id format")
    .notEmpty()
    .withMessage("subCateogry must be belong to category"),
  body("title").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  check("category")
    .notEmpty()
    .withMessage("subCateogry must be belong to category")
    .isMongoId()
    .withMessage("Invalid Category id format")
    .custom((categoryId) =>
      Category.findById(categoryId).then((cateogry) => {
        if (!cateogry) {
          return Promise.reject(
            new Error(`No Category for this id : ${categoryId}`)
          );
        }
      })
    ),
  validatorMiddleware,
];
exports.deleteCategroyValidator = [
  check("id").isMongoId().withMessage("Invalid subCategory id format"),
  validatorMiddleware,
];
