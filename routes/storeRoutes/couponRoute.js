const express = require("express");
const {
  getCouponValidator,
  createCouponValidator,
  updateCouponValidator,
  deleteCouponValidator,
} = require("../../utils/validators/storeValidators/couponValidator");
const authServices = require("../../services/authServices");
const {
  getCoupons,
  createCoupon,
  getCoupon,
  updateCoupon,
  deleteCoupon,
} = require("../../services/storeServices/couponService");

const router = express.Router();
router.use(authServices.protect, authServices.allowedTo("admin", "manager"));
router.route("/").get(getCoupons).post(createCouponValidator, createCoupon);
router
  .route("/:id")
  .get(getCouponValidator, getCoupon)
  .put(updateCouponValidator, updateCoupon)
  .delete(deleteCouponValidator, deleteCoupon);

module.exports = router;
