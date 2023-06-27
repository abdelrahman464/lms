const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, "Too short product title"],
      maxlength: [100, "too Shot product title"],
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
      minlength: [20, "Too short Product description"],
    },
    quantity: {
      type: Number,
      required: [true, "Product quantity is required"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      trim: true,
      max: [200000, "Too long Product price"],
    },
    priceAfterDiscount: {
      type: Number,
    },
    colors: [String],
    imageCover: {
      type: String,
      required: [true, "Product image cover is required"],
    },
    images: [String],
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "Product category is required"],
    },
    subCategories: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "subCategory",
      },
    ],
    brand: {
      type: mongoose.Schema.ObjectId,
      ref: "Brand",
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
productSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "product",
  localField: "_id",
});

// ^find => it mean if part of of teh word contains find
productSchema.pre(/^find/, function (next) {
  // this => query
  this.populate({
    path: "subCategories",
    select: "name -_id",
  });
  this.populate({
    path: "category",
    select: "name -_id",
  });
  this.populate({
    path: "brand",
    select: "name -_id",
  });

  next();
});

const setImageURL = (doc) => {
  //return image base url + iamge name
  if (doc.imageCover) {
    const imageUrl = `${process.env.BASE_URL}/store/products/${doc.imageCover}`;
    doc.imageCover = imageUrl;
  }
  if (doc.images) {
    const imageListWithUrl = [];
    doc.images.forEach((image) => {
      const imageUrl = `${process.env.BASE_URL}/store/products/${image}`;
      imageListWithUrl.push(imageUrl);
    });
    doc.images = imageListWithUrl;
  }
};
//after initializ the doc in db
// check if the document contains image
// it work with findOne,findAll,update
productSchema.post("init", (doc) => {
  setImageURL(doc);
});
// it work with create
productSchema.post("save", (doc) => {
  setImageURL(doc);
});

const ProductModel = mongoose.model("Product", productSchema);
module.exports = ProductModel;
