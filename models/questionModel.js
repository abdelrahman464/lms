const mongoose = require("mongoose");

const questionsSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
});
const Question = mongoose.model("questions", questionsSchema);

module.exports = Question;