const mongoose = require("mongoose");
const Lesson = require("./educationLessonModel");
const POST = require("../analyticModels/analyticPostModel");

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
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AnalyticPost",
      },
    ],
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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

educationCourseSchema.pre(/^find/, function (next) {
  this.populate({ path: "instructor", select: "name" });
  this.populate({ path: "category", select: "title" });
  next();
});

educationCourseSchema.pre("remove", async function (next) {
  //delete lessons related to sections related to course

  await Lesson.deleteMany({ course: this._id });

  //delete current course's posts
  await POST.deleteMany({ course: this._id });
  next();
});
const Course = mongoose.model("EducationCourse", educationCourseSchema);

module.exports = Course;
