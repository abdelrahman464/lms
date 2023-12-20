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
    orderNumber: {
      type: Number,
    },
  },
  {
    timeseries: true,
    // to enable vitual population
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
//@use: auto assigment for orderNumber when new Course is added
educationCourseSchema.pre("save", async function (next) {
  try {
    if (!this.orderNumber) {
      // If the course doesn't have an orderNumber, assign one based on the existing number of courses
      const existingCoursesCount = await this.constructor.countDocuments();

      // Assign the orderNumber as the next number in the sequence
      this.orderNumber = existingCoursesCount + 1;
    }

    // Continue with the save operation
    next();
  } catch (error) {
    next(error);
  }
});

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
