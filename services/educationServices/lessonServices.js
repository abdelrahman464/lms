const asyncHandler = require("express-async-handler");
const ApiError = require("../../utils/apiError");
const Lesson = require("../../models/educationModel/educationLessonModel");
const Section = require("../../models/educationModel/educationSectionModel");
const factory = require("./handllerFactory");
// Create a new lesson
exports.createLesson = asyncHandler(async (req, res, next) => {
  const { section, title, videoUrl } = req.body;
  // Create a new section
  const lesson = new Lesson({
    title,
    section,
    videoUrl,
  });
  //check if section exists
  const currentSection = await Section.findById(section);
  if (!currentSection) {
    return next(new ApiError(`Section not found`, 404));
  }
  //save
  await lesson.save();

  res.status(201).json({ success: true, lesson });
});

// Get all lessons of a section
exports.getLessonsBySectionId = factory.getALl(Lesson);

// Get a specific lesson by ID
exports.getLessonById = factory.getOne(Lesson);

// Update a lesson by ID
exports.updateLesson = factory.updateOne(Lesson);

// Delete a lesson by ID
exports.deleteLesson = factory.deleteOne(Lesson);