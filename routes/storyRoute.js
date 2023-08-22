const express = require("express");
const authServices = require("../services/authServices");
const {
  createStory,
  getAllStories,
  getStory,
  updateStory,
  deleteStory,
  uploadStoryImage,
  resizeImage,
} = require("../services/storyService");

const router = express.Router();

// Create a new video
router.post(
  "/",
  authServices.protect,
  authServices.allowedTo("admin"),
  uploadStoryImage,
  resizeImage,
  createStory
);
// Get all videos
router.get(
  "/",
  getAllStories
);

// Get a specific lesson by ID
router.get(
  "/:id",
  getStory
);

// Update a lesson by ID
router.put(
  "/:id",
  authServices.protect,
  authServices.allowedTo("admin"),
  uploadStoryImage,
  resizeImage,
  updateStory
);

// Delete a lesson by ID
router.delete(
  "/:id",
  authServices.protect,
  authServices.allowedTo("admin"),
  deleteStory
);

module.exports = router;