const express = require("express");
const {
  createSection,
  updateSection,
  deleteSection,
  getSectionById,
  getSectionsByCourseId,
} = require("../../services/educationServices/sectionService");

const router = express.Router();
// Create a new section
router.post("/", createSection);

// Get all sections of a course
router.get("/", getSectionsByCourseId);

// Get a specific section by ID
router.get("/:id", getSectionById);

// Update a section by ID
router.put("/:id", updateSection);

// Delete a section by ID
router.delete("/:id", deleteSection);

module.exports = router;
