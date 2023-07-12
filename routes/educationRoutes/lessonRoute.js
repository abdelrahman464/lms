const express = require("express");
const authServices = require("../../services/authServices");
const {checkAuthority2}=require("../../utils/validators/educationValidators/lessonsValidator")
const {
  createLesson,
  updateLesson,
  deleteLesson,
  getLessonById,
  getLessonsBySectionId,
  relatedLessons
} = require("../../services/educationServices/lessonServices");

const router = express.Router();
// Create a new lesson
router.post("/", createLesson);
// Get all lessons of a section
router.get("/", getLessonsBySectionId);

// Get a specific lesson by ID
router.get("/:id", getLessonById);
//Get course with CategoryId 
router.get(
  "/relatedLessons/:courseId",
  authServices.protect,
  checkAuthority2,
  relatedLessons
);

// Update a lesson by ID
router.put("/:id", updateLesson);

// Delete a lesson by ID
router.delete("/:id", deleteLesson);

module.exports = router;
