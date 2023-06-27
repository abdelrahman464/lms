const { body } = require("express-validator");
const Product = require("../../../models/storeModels/storeProductModel");
const ApiError = require("../../apiError");
const validatorMiddleware = require("../../../middlewares/validatorMiddleware");

exports.addProductToWishlistValidator = [
  body("productId")
    .notEmpty()
    .withMessage("Product required")
    .isMongoId()
    .withMessage("Invalid ID format")
    .custom((productId) =>
      Product.findById(productId).then((product) => {
        if (!product) {
          return Promise.reject(
            new ApiError(`No Product for this id : ${productId}`, 404)
          );
        }
      })
    ),
  validatorMiddleware,
];
