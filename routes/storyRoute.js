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
  authServices.allowedTo("admin","user","instructor"),
  uploadStoryImage,
  resizeImage,
  createStory
);
// Get all videos
router.get(
  "/",
  authServices.protect,
  authServices.allowedTo("admin","user","instructor"),
  getAllStories
);

// Get a specific lesson by ID
router.get(
  "/:id",
  authServices.protect,
  authServices.allowedTo("admin","user","instructor"),
  getStory
);

// Update a lesson by ID
router.put(
  "/:id",
  authServices.protect,
  authServices.allowedTo("admin","user","instructor"),
  uploadStoryImage,
  resizeImage,
  updateStory
);

// Delete a lesson by ID
router.delete(
  "/:id",
  authServices.protect,
  authServices.allowedTo("admin","user","instructor"),
  deleteStory
);

module.exports = router;
