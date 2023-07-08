const asyncHandler = require("express-async-handler");
const ApiError = require("../../utils/apiError");
const Section = require("../../models/educationModel/educationSectionModel");
const Course = require("../../models/educationModel/educationCourseModel");
const factory = require("./handllerFactory");

// Create a new section
exports.createSection = asyncHandler(async (req, res, next) => {
  const { course, title } = req.body;
  // Create a new section
  const section = new Section({
    title,
    course,
  });

  const currentCourse = await Course.findById(course);
  if (!currentCourse) {
    return next(new ApiError(`Course not found`, 404));
  }
  currentCourse.sections.push(section._id);
  await currentCourse.save();

  await section.save();

  res.status(201).json({ success: true, section });
});

// Get all sections of a course
exports.getSectionsByCourseId = factory.getALl(Section);
// Get a specific section by ID
exports.getSectionById = factory.getOne(Section);
// Update a section by ID
exports.updateSection = factory.updateOne(Section);
// Delete a section by ID
exports.deleteSection =factory.deleteOne(Section);