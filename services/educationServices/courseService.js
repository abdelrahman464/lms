const Course = require("../../models/educationModel/educationCourseModel");
const factory = require("../handllerFactory");

// middleware to add categoryId to body
exports.setinstructorIdToBody = (req, res, next) => {
  req.body.instructor = req.user._id;
  next();
};

//filter subCategories in specefic category by categoryId
exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) filterObject = { category: req.params.categoryId };
  req.filterObj = filterObject;
  next();
};
// Create a new course
exports.createCourse = factory.createOne(Course);

// Get all courses
exports.getAllCourses = factory.getALl(Course);

// Get a specific course by ID
exports.getCourseById = factory.getOne(Course, "EducationSection");

// Update a course by ID
exports.updateCourse = factory.updateOne(Course);

// Delete a course by ID
exports.deleteCourse = factory.deleteOne(Course);
