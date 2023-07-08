const mongoose = require("mongoose");
const Section = require("./educationSectionModel");
const Lesson = require("./educationLessonModel");

const educationCourseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "Course price is required"],
      trim: true,
      max: [200000, "Too long Course price"],
    },
    priceAfterDiscount: {
      type: Number,
    },
    image: {
      type: String,
      // required: [true, "Course image is required"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EducationCategory",
    },

    ratingsAverage: {
      type: Number,
      min: [1, "rating must be between 1.0 and 5.0"],
      max: [5, "rating must be between 1.0 and 5.0"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  {
    timeseries: true,
    // to enable vitual population
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
// virtual field =>reviews
educationCourseSchema.virtual("reviews", {
  ref: "EducationReview",
  foreignField: "course",
  localField: "_id",
});

educationCourseSchema.pre("remove", async function (next) {
  //delete lessons related to sections related to course
  const sections = await Section.find({ course: this._id });
  const sectionIds = sections.map((section) => section._id);
  await Lesson.deleteMany({ section: { $in: sectionIds } }); // worked
  //delete current course's sections
  await Section.deleteMany({ course: this._id });
  next();
});
const Course = mongoose.model("EducationCourse", educationCourseSchema);

module.exports = Course;
