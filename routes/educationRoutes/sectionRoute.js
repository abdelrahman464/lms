const express = require("express");
const authServices = require("../../services/authServices");
const {checkAuthority}=require("../../services/educationServices/packageServices")
const {
  createSection,
  updateSection,
  deleteSection,
  getSectionById,
  getSectionsByCourseId,
  relatedSections
} = require("../../services/educationServices/sectionService");

const router = express.Router();
// Create a new section
router.post("/", createSection);

// Get all sections of a course
router.get("/", getSectionsByCourseId);

// Get a specific section by ID
router.get("/:id", getSectionById);
//Get sections with courseId 
router.get(
  "/relatedSections/:courseId",
  authServices.protect,
  checkAuthority,
  relatedSections
);


// Update a section by ID
router.put("/:id", updateSection);

// Delete a section by ID
router.delete("/:id", deleteSection);

module.exports = router;
