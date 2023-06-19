const { check } = require("express-validator");
const validatorMiddleware = require("../../../middlewares/validatorMiddleware");
const Product = require("../../../models/storeModels/productModel");
const Cart = require("../../../models/storeModels/cartModel");

exports.addProductToCartValidator = [
  check("productId")
    .notEmpty()
    .withMessage("Product id is required")
    .isMongoId()
    .withMessage("Invalid ID format")
    .custom((productId) =>
      Product.findById(productId).then((product) => {
        if (!product) {
          return Promise.reject(
            new Error(`No product for this id : ${productId}`)
          );
        }
      })
    ),
  check("color")
    .optional()
    .custom(async (val, { req }) => {
      const product = await Product.findById(req.body.productId);
      if (!product.colors.includes(val)) {
        throw new Error("Invalid color selected for this item");
      }
      return true;
    }),

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
      return new Error(`there is no item for this id `);
    }
    return true;
  }),
  validatorMiddleware,
];
exports.applayCouponValidator = [
  check("coupon").notEmpty().withMessage("coupon is required"),
  validatorMiddleware,
];
