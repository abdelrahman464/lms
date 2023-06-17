const express = require("express");
const {
  addProductToCartValidator,
  removeSpecificCartItemValidator,
  updateCartItemQuantityValidator,
  applayCouponValidator,
} = require("../../utils/validators/storeValidator/cartValidator");
const authServices = require("../../services/authServices");
const {
  addProductToCart,
  getLoggedUserCart,
  removeSpecificCartItem,
  clearCart,
  updateCartItemQuantity,
  applayCoupon,
} = require("../../services/storeServices/cartServices");

const router = express.Router();
router.use(authServices.protect, authServices.allowedTo("user"));

router
  .route("/")
  .post(addProductToCartValidator, addProductToCart)
  .get(getLoggedUserCart)
  .delete(clearCart);

router.put("/applaycoupon", applayCouponValidator, applayCoupon);
router
  .route("/:itemId")
  .delete(removeSpecificCartItemValidator, removeSpecificCartItem)
  .put(updateCartItemQuantityValidator, updateCartItemQuantity);

module.exports = router;
