const express = require("express");

const {
  addCourseToWishlistValidator,
} = require("../../utils/validators/educationValidators/wishlistValidator");
const {
  addCourseToWishlist,
  removeCourseFromWishlist,
  getLoggedUserWishlist,
} = require("../../services/educationServices/wishlistService");
const authServices = require("../../services/authServices");

const router = express.Router();

router.use(authServices.protect, authServices.allowedTo("user"));

router
  .route("/")
  .get(getLoggedUserWishlist)
  .post(addCourseToWishlistValidator, addCourseToWishlist);
router.delete("/:courseId", removeCourseFromWishlist);

module.exports = router;
