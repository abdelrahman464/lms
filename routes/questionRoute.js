const express = require("express");
const authServices = require("../services/authServices");
const {
  createQuestion,
  getAllQuestions,
  getQuestion,
  updateQuestion,
  deleteQuestion,
} = require("../services/questionService");

const router = express.Router();

// Create a new video
router.post(
  "/",
  authServices.protect,
  authServices.allowedTo("admin"),
  createQuestion
);
// Get all videos
router.get("/", getAllQuestions);

// Get a specific lesson by ID
router.get("/:id", getQuestion);

// Update a lesson by ID
router.put(
  "/:id",
  authServices.protect,
  authServices.allowedTo("admin"),
  updateQuestion
);

// Delete a lesson by ID
router.delete(
  "/:id",
  authServices.protect,
  authServices.allowedTo("admin"),
  deleteQuestion
);

module.exports = router;
