const { check } = require("express-validator");
const validatorMiddleware = require("../../../middlewares/validatorMiddleware");
const Product = require("../../../models/storeModels/storeProductModel");
const Cart = require("../../../models/storeModels/storeCartModel");

exports.addProductToCartValidator = [
  check("productId")
    .notEmpty()
    .withMessage("Product id is required")
    .isMongoId()
    .withMessage("Invalid ID format")
    .custom((productId) =>
      Product.findById(productId).then((product) => {
        if (!product) {
          return Promise.reject(new Error("Product Not Found"));
        }
      })
    ),

  validatorMiddleware,
];
exports.removeSpecificCartItemValidator = [
  check("itemId").isMongoId().withMessage("Invalid ID format"),
  validatorMiddleware,
];
exports.updateCartItemQuantityValidator = [
  check("itemId").isMongoId().withMessage("Invalid ID format"),
  check("quantity").custom(async (val, { req, next }) => {
    const cart = await Cart.findOne({ user: req.user._id });

    const itemIndex = cart.cartItems.findIndex(
      (item) => item._id.toString() === req.params.itemId
    );
    if (itemIndex > -1) {
      const cartItem = cart.cartItems[itemIndex];
      const currentProduct = await Product.findById(cartItem.product);
      if (currentProduct.quantity < val) {
        throw new Error("Invalid quantity selected for this item");
      }
    } else {
      return new Error(`Item Not Found`);
    }
    return true;
  }),
  validatorMiddleware,
];
exports.applayCouponValidator = [
  check("coupon").notEmpty().withMessage("coupon is required"),
  validatorMiddleware,
];
