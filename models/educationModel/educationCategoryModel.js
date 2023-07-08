// database
const mongoose = require("mongoose");
const Course=require("./educationCourseModel");
const Section=require('./educationSectionModel');
const Lesson=require('./educationLessonModel');
//1- create schema
const educationCategorySchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "category required"],
      unique: [true, "category must be unique"],
      minlength: [3, "too short category name"],
      maxlength: [32, "too long category name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);

const setImageURL = (doc) => {
  //return image base url + iamge name
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/education/categories/${doc.image}`;
    doc.image = imageUrl;
  }
};
//after initializ the doc in db
// check if the document contains image
// it work with findOne,findAll,update
educationCategorySchema.post("init", (doc) => {
  setImageURL(doc);
});
// it work with create
educationCategorySchema.post("save", (doc) => {
  setImageURL(doc);
});
educationCategorySchema.pre("remove", async function (next) { //course sections lesson 
  // Remove sections of courses relted to category
  const courses = await Course.find({ category: this._id });
  const courseIds = courses.map(course => course._id); //[1.2.3]

  const sections = await Section.find({ course: { $in: courseIds } });
  const sectionIds = sections.map(section => section._id); //[1.2.3]
  //delete sections related to courses related to category
  await Section.deleteMany({ course: { $in: courseIds } });
  //delete sections related to lessons related to category
  await Lesson.deleteMany({ section: { $in: sectionIds } });
  // Delte the course
  await Course.deleteMany({ category: this._id });

  next(); 
});
//2- create model
const CategoryModel = mongoose.model(
  "EducationCategory",
  educationCategorySchema
);

module.exports = CategoryModel;
