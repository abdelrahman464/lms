// database
const mongoose = require("mongoose");
//1- create schema
const storeBrnadSchema = mongoose.Schema(
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
    const imageUrl = `${process.env.BASE_URL}/store/brands/${doc.image}`;
    doc.image = imageUrl;
  }
};
//after initializ the doc in db
// check if the document contains image
// it work with findOne,findAll,update
storeBrnadSchema.post("init", (doc) => {
  setImageURL(doc);
});
// it work with create
storeBrnadSchema.post("save", (doc) => {
  setImageURL(doc);
});



//2- create model
const BrandModel = mongoose.model("StoreBrand", storeBrnadSchema);

module.exports = BrandModel;
