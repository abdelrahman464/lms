const express = require("express");
const {
  addCourseToCartValidator,
  removeSpecificCartItemValidator,
  applayCouponValidator,
} = require("../../utils/validators/educationValidators/cartValidator");
const authServices = require("../../services/authServices");
const {
  addCourseToCart,
  getLoggedUserCart,
  removeSpecificCartItem,
  clearCart,
  applayCoupon,
} = require("../../services/educationServices/cartServices");

const router = express.Router();
router.use(authServices.protect, authServices.allowedTo("user"));

router
  .route("/")
  .post(addCourseToCartValidator, addCourseToCart)
  .get(getLoggedUserCart)
  .delete(clearCart);

router.put("/applaycoupon", applayCouponValidator, applayCoupon);
router
  .route("/:itemId")
  .delete(removeSpecificCartItemValidator, removeSpecificCartItem)

module.exports = router;
