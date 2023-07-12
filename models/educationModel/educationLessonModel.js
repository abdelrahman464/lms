const mongoose = require("mongoose");

const educationLessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "EducationCourse",
  },
  type:{
    type:String ,
    required:[true,"lesson's type is required"]
  },
  videoUrl: {
    type: String,
    required: true,
  },
});

const Lesson = mongoose.model("EducationLesson", educationLessonSchema);

module.exports = Lesson;
