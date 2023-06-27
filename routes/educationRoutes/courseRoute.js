const express = require("express");
const {
  createCourse,
  setCategoryIdToBody,
  getAllCourses,
  createFilterObj,
  getCourseById,
  deleteCourse,
  updateCourse,
} = require("../../services/educationServices/courseService");

// nested routes
const reviewsRoute = require("./reviewRoute");

const router = express.Router({ mergeParams: true });

router.use("/:courseId/reviews", reviewsRoute);

// Create a new course
router.post("/", setCategoryIdToBody, createCourse);

// Get all courses
router.get("/", createFilterObj, getAllCourses);

// Get a specific course by ID
router.get("/:id", getCourseById);

// Update a course by ID
router.put("/:id", updateCourse);

// Delete a course by ID
router.delete("/:id", deleteCourse);

module.exports = router;
