const asyncHandler = require("express-async-handler");
const ApiError = require("../../utils/apiError");
const Lesson = require("../../models/educationModel/educationLessonModel");
const Course = require("../../models/educationModel/educationCourseModel");
const factory = require("../handllerFactory");
// Create a new lesson
exports.createLesson = asyncHandler(async (req, res, next) => {
  const { course, title,type, videoUrl } = req.body;
  // Create a new section
  const lesson = new Lesson({
    title,
    course,
    type,
    videoUrl,
  });
  //check if section exists
  const currentCourse = await Course.findById(course);
  if (!currentCourse) {
    return next(new ApiError(`course not found`, 404));
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

exports.relatedLessons=asyncHandler(async(req,res)=>{
  const {courseId}=req.params;
  const lessons=  await Lesson.find({course:courseId});
  res.status(200).json({data:lessons});
  
})