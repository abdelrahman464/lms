const asyncHandler = require("express-async-handler");
const ApiError = require("../../utils/apiError");
const Lesson = require("../../models/educationModel/educationLessonModel");
const Section = require("../../models/educationModel/educationSectionModel");
const Course = require("../../models/educationModel/educationCourseModel");
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
  //check if course  exists
  const currentCourse = await Course.findById(currentSection.course);
  if (!currentCourse) {
    return next(new ApiError(`Course not found`, 404));
  }

  //section
  currentSection.lessons.push(lesson._id);
  await currentSection.save();

  //course
  currentCourse.lessons.push(lesson._id);
  await currentCourse.save();

  //save
  lesson.course = currentSection.course;
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
exports.deleteLesson = asyncHandler(async (req, res, next) => {
  const { id } = req.params; //sectionId
  //check if lesson exists
  const lesson = await Lesson.findById(id);
  if (!lesson) {
    return next(new ApiError(`Lesson not found`, 404));
  }
  //check if section exists
  const section = await Section.findById(lesson.section);
  if (!section) {
    return next(new ApiError(`Section not found`, 404));
  }
  //check if course exists
  const course = await Course.findById(lesson.course);
  if (!course) {
    return next(new ApiError(`Course not found`, 404));
  }
  //remove the lesson from the section
  section.lessons = section.lessons.filter((c) => c.toString() !== id);
  await section.save();
  //remove the lesson from the course
  course.lessons = course.lessons.filter((c) => c.toString() !== id);
  await course.save();

  await Lesson.findByIdAndDelete(id);

  res.status(200).json({ success: true });
});
