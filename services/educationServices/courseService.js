const asyncHandler = require("express-async-handler");
const ApiError = require("../../utils/apiError");
const Course = require("../../models/educationModel/educationCourseModel");
const factory = require("./handllerFactory");




// middleware to add categoryId to body
exports.setCategoryIdToBody = (req, res, next) => {
  //Nested Route
  if (!req.body.category) req.body.category = req.params.categoryId;
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
exports.createCourse = asyncHandler(async (req, res) => {
  const { description, title, price, priceAfterDiscount } = req.body;
  const course = await Course.create({
    description,
    title,
    price,
    priceAfterDiscount,
  });
  res.json(course);
});

// Get all courses
exports.getAllCourses = factory.getALl(Course);

// Get a specific course by ID
exports.getCourseById = factory.getOne(Course, "sections");

// Update a course by ID
exports.updateCourse = factory.updateOne(Course);

// Delete a course by ID
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const { id } = req.params; //sectionId
  //check if lesson exists
  const course = await Course.findById(id);
  if (!course) {
    return next(new ApiError(`Course not found`, 404));
  }
  course.remove();
  
  await Course.findByIdAndDelete(id);

  res.status(200).json({ success: true });
});
