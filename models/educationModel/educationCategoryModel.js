// database
const mongoose = require("mongoose");
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
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "EducationCourse",
      },
    ],
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

//2- create model
const CategoryModel = mongoose.model(
  "EducationCategory",
  educationCategorySchema
);

module.exports = CategoryModel;
