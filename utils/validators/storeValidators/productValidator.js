const { check } = require("express-validator");
const slugify = require("slugify");
const validatorMiddleware = require("../../../middlewares/validatorMiddleware");
const Category = require("../../../models/storeModels/categoryModel");
const SubCategory = require("../../../models/storeModels/subCategoryModel");
const Brand = require("../../../models/storeModels/brandModel");
const ApiError = require("../../apiError");

exports.createProductValidator = [
  check("title")
    .isLength({ min: 3 })
    .withMessage("must be at least 3 chars")
    .notEmpty()
    .withMessage("Product required")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("description")
    .notEmpty()
    .withMessage("Product description is required")
    .isLength({ min: 20 })
    .withMessage("Too short description")
    .isLength({ max: 2000 })
    .withMessage("Too long description"),
  check("quantity")
    .notEmpty()
    .withMessage("Product quantity is required")
    .isNumeric()
    .withMessage("Product quantity must be a number"),
  check("sold")
    .optional()
    .isNumeric()
    .withMessage("Product quantity must be a number"),
  check("price")
    .notEmpty()
    .withMessage("Product price is required")
    .isNumeric()
    .withMessage("Product price must be a number")
    .isLength({ max: 32 })
    .withMessage("To long price"),
  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("Product priceAfterDiscount must be a number")
    .toFloat()
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error("priceAfterDiscount must be lower than price");
      }
      return true;
    }),
  check("colors")
    .optional()
    .isArray()
    .withMessage("availableColors should be array of string"),
  check("imageCover").notEmpty().withMessage("Product imageCover is required"),
  check("images")
    .optional()
    .isArray()
    .withMessage("images should be array of string"),
  check("category")
    .notEmpty()
    .withMessage("Product must be belong to a category")
    .isMongoId()
    .withMessage("Invalid ID format")
    // before i add product to category i must check if category is in database
    .custom((categoryId) =>
      Category.findById(categoryId).then((category) => {
        if (!category) {
          return Promise.reject(
            new ApiError(`No category for this id: ${categoryId}`, 404)
          );
        }
      })
    ),
  check("subCategories")
    .optional()
    .isArray()
    .withMessage("subCategories should be array of string")
    .isMongoId()
    .withMessage("Invalid ID format")
    //check subcategories exist in databse befor add product to subcats
    // _id:{exists:true} => filter subcats by id => gives me subcats that have id
    //_id:{exists:true,$in :subCategoriesIds} =>  first i checked if the subcats have id second i checked if these ids in the array of subcats that i send in body
    .custom((subcategoriesIds) =>
      SubCategory.find({ _id: { $exists: true, $in: subcategoriesIds } }).then(
        (result) => {
          if (result.length < 1 || result.length !== subcategoriesIds.length) {
            return Promise.reject(
              new ApiError(`Invalid subcategories Ids`, 403)
            );
          }
        }
      )
    )
    // make sure that subcategories from body belongs to cateogry from body
    .custom((val, { req }) =>
      SubCategory.find({ category: req.body.category }).then(
        (subcategories) => {
          const subCategoriesIdsInDB = [];
          subcategories.forEach((subCategory) => {
            subCategoriesIdsInDB.push(subCategory._id.toString());
          });
          // check if subcategories ids in db include subcategories in req.body (true)
          const checker = (target, arr) => target.every((v) => arr.includes(v));
          if (!checker(val, subCategoriesIdsInDB)) {
            return Promise.reject(
              new ApiError(`subcategories not belong to category`, 403)
            );
          }
        }
      )
    ),
  check("brand")
    .optional()
    .isMongoId()
    .withMessage("Invalid ID format")
    .custom((brandId) =>
      Brand.findById(brandId).then((brand) => {
        if (!brand) {
          return Promise.reject(new Error(`No brand for this id : ${brandId}`));
        }
      })
    ),
  check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("ratingsAverage must be a number")
    .isLength({ min: 1 })
    .withMessage("Rating must be above or equal 1.0")
    .isLength({ max: 5 })
    .withMessage("Rating must be below or equal 5.0"),
  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("ratingsQuantity must be a number"),

  //catch error and return it as a response
  validatorMiddleware,
];

exports.getProductValidator = [
  check("id").isMongoId().withMessage("Invalid ID format"),
  validatorMiddleware,
];

exports.updateProductValidator = [
  check("id").isMongoId().withMessage("Invalid ID format"),
  check("title")
    .optional()
    .isLength({ min: 3 })
    .withMessage("must be at least 3 chars")
    .notEmpty()
    .withMessage("Product required")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("description")
    .optional()
    .isLength({ min: 20 })
    .withMessage("Too short description")
    .isLength({ max: 2000 })
    .withMessage("Too long description"),
  check("quantity")
    .optional()
    .isNumeric()
    .withMessage("Product quantity must be a number"),
  check("sold")
    .optional()
    .isNumeric()
    .withMessage("Product quantity must be a number"),
  check("price")
    .optional()
    .isNumeric()
    .withMessage("Product price must be a number")
    .isLength({ max: 32 })
    .withMessage("To long price"),
  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("Product priceAfterDiscount must be a number")
    .toFloat()
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error("priceAfterDiscount must be lower than price");
      }
      return true;
    }),
  check("colors")
    .optional()
    .isArray()
    .withMessage("availableColors should be array of string"),
  check("imageCover").optional(),
  check("images")
    .optional()
    .isArray()
    .withMessage("images should be array of string"),
  check("category")
    .optional()
    .isMongoId()
    .withMessage("Invalid ID format")
    // before i add product to category i must check if category is in database
    .custom((categoryId) =>
      Category.findById(categoryId).then((cateogry) => {
        if (!cateogry) {
          return Promise.reject(
            new Error(`No Category for this id : ${categoryId}`)
          );
        }
      })
    ),
  check("subCategories")
    .optional()
    .isArray()
    .withMessage("subCategories should be array of string")
    .isMongoId()
    .withMessage("Invalid ID format")
    //check subcategories exist in databse befor add product to subcats
    // _id:{exists:true} => filter subcats by id => gives me subcats that have id
    //_id:{exists:true,$in :subCategoriesIds} =>  first i checked if the subcats have id second i checked if these ids in the array of subcats that i send in body
    .custom((subCategoriesIds) =>
      SubCategory.find({ _id: { $exists: true, $in: subCategoriesIds } }).then(
        (result) => {
          //Length result  must equal  subcats in body
          if (result.length < 1 || result.length !== subCategoriesIds.length) {
            return Promise.reject(new Error(`Invalid subCateogries Ids`));
          }
        }
      )
    )
    // make sure that subcategories from body belongs to cateogry from body
    .custom((val, { req }) =>
      SubCategory.find({ category: req.body.category }).then(
        (subcategories) => {
          const subCategoriesIdsInDB = [];
          subcategories.forEach((subCategory) => {
            subCategoriesIdsInDB.push(subCategory._id.toString());
          });

          // check if subcategories ids in db include subcategories in req.body (true)
          const checker = (target, arr) => target.every((v) => arr.includes(v));
          if (!checker(val, subCategoriesIdsInDB)) {
            return Promise.reject(
              new Error(`subcategories not belong to category `)
            );
          }
        }
      )
    ),
  check("brand")
    .optional()
    .isMongoId()
    .withMessage("Invalid ID format") // before i add product to category i must check if category is in database
    .custom((brandId) =>
      Brand.findById(brandId).then((brand) => {
        if (!brand) {
          return Promise.reject(new Error(`No brand for this id : ${brandId}`));
        }
      })
    ),
  check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("ratingsAverage must be a number")
    .isLength({ min: 1 })
    .withMessage("Rating must be above or equal 1.0")
    .isLength({ max: 5 })
    .withMessage("Rating must be below or equal 5.0"),
  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("ratingsQuantity must be a number"),

  validatorMiddleware,
];

exports.deleteProductValidator = [
  check("id").isMongoId().withMessage("Invalid ID format"),
  validatorMiddleware,
];
