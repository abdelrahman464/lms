const mongoose = require("mongoose");

const storeSubCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: [true, "category must be unique"],
      minlength: [2, "too short subCategory name"],
      maxlength: [32, "too long subCategory name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "StoreCategory",
      required: [true, "subCategory must be belong to parent category"],
    },
  },
  { timestamps: true }
);
// ^find => it mean if part of of teh word contains find
storeSubCategorySchema.pre(/^find/, function (next) {
  // this => query
  this.populate({
    path: "category",
    select: "name -_id",
  });
  next();
});

const subCategory = mongoose.model("StoresubCategory", storeSubCategorySchema);
module.exports = subCategory;
