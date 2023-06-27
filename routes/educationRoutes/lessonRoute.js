const express = require("express");
const {
  createLesson,
  updateLesson,
  deleteLesson,
  getLessonById,
  getLessonsBySectionId,
} = require("../../services/educationServices/lessonServices");

const router = express.Router();
// Create a new lesson
router.post("/", createLesson);
// Get all lessons of a section
router.get("/", getLessonsBySectionId);

// Get a specific lesson by ID
router.get("/:id", getLessonById);

// Update a lesson by ID
router.put("/:id", updateLesson);

// Delete a lesson by ID
router.delete("/:id", deleteLesson);

module.exports = router;
