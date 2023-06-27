const mongoose = require("mongoose");
const Lesson = require("./educationLessonModel");

const sectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
  lessons: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
    },
  ],
});

sectionSchema.pre("remove", async function (next) {
  // Remove all lessons associated with the section
  await Lesson.deleteMany({ _id: { $in: this.lessons } });

  next();
});
const Section = mongoose.model("Section", sectionSchema);

module.exports = Section;
