const express = require("express");
const authServices = require("../services/authServices");
const {
  setUserIdTobody,
  canReviewSystem,
  createSystemReview,
  getAllSystemReviews,
  getSystemReview,
  updateSystemReview,
  deleteSystemReview,
  getMyReview,
} = require("../services/systemReviewService");
const {
  createReviewValidator,
  checkIdValidator,
} = require("../utils/validators/systemReviewValidator");
const router = express.Router();

// Create a new video
router.get("/getMyReview", authServices.protect, getMyReview);
router.post(
  "/",
  authServices.protect,
  authServices.allowedTo("admin"),
  canReviewSystem,
  createReviewValidator,
  setUserIdTobody,
  createSystemReview
);
// Get all videos
router.get("/", getAllSystemReviews);

// Get a specific lesson by ID
router.get(
  "/:id",
  authServices.protect,
  authServices.allowedTo("admin"),
  checkIdValidator,
  getSystemReview
);
// Update a lesson by ID
router.put(
  "/:id",
  authServices.protect,
  authServices.allowedTo("admin"),
  checkIdValidator,
  updateSystemReview
);

// Delete a lesson by ID
router.delete(
  "/:id",
  authServices.protect,
  authServices.allowedTo("admin"),
  checkIdValidator,
  deleteSystemReview
);

module.exports = router;
