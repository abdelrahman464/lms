const mongoose = require("mongoose");

const educationLiveSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  day: {
    type: Number,
    required: [true, "which day the live will be ?"],
  },
  month: {
    type: Number,
    required: [true, "which month the live will be ?"],
  },
  hour: {
    type: String,
    required: [true, "which hour the live will be ?"],
  },
  duration: {
    type: Number,
    required: [true, "what is the duration of the live will be ?"],
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "EducationCourse",
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  link: {
    type: String,
  },
  info: String,
  followers: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      email: {
        type: String,
      },
    },
  ],
});

// ^find => it mean if part of of teh word contains find
educationLiveSchema.pre(/^find/, function (next) {
  // this => query
  this.populate({ path: "creator", select: "name" });
  this.populate({ path: "course", select: "title" });
  next();
});
const Live = mongoose.model("Educationlive", educationLiveSchema);

module.exports = Live;
