const express = require("express");
const authServices = require("../services/authServices");
const {
  setUserIdTobody,
  createSystemReview,
  getAllSystemReviews,
  getSystemReview,
  updateSystemReview,
  deleteSystemReview,
} = require("../services/systemReviewService");

const router = express.Router();

// Create a new video
router.post("/", authServices.protect, setUserIdTobody, createSystemReview);
// Get all videos
router.get("/", getAllSystemReviews);

// Get a specific lesson by ID
router.get("/:id", getSystemReview);

// Update a lesson by ID
router.put("/:id", updateSystemReview);

// Delete a lesson by ID
router.delete("/:id", deleteSystemReview);

module.exports = router;
