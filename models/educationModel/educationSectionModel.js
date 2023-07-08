const mongoose = require("mongoose");
const Lesson = require("./educationLessonModel");

const educationSectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "EducationCourse",
  },
});

educationSectionSchema.pre("remove", async function (next) {
  // Remove all lessons associated with the section
  await Lesson.deleteMany({ section: this._id });

  next();
});
const Section = mongoose.model("EducationSection", educationSectionSchema);

module.exports = Section;
