const mongoose = require("mongoose");

const educationLessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  section: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "EducationSection",
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "EducationCourse",
  },
  videoUrl: {
    type: String,
    required: true,
  },
});

const Lesson = mongoose.model("EducationLesson", educationLessonSchema);

module.exports = Lesson;