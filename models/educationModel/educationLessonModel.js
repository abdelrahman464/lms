const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  section: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Section",
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
  videoUrl: {
    type: String,
    required: true,
  },
});

const Lesson = mongoose.model("Lesson", lessonSchema);

module.exports = Lesson;
