const mongoose = require("mongoose");

const storeProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, "Too short product title"],
      maxlength: [100, "too Shot product title"],
    },
    auther: String,
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    pdf: [String],
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
    imageCover: {
      type: String,
      required: [true, "Product image cover is required"],
    },
    images: [String],
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "StoreCategory",
      required: [true, "Product category is required"],
    },
    subCategories: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "StoreSubCategory",
      },
    ],
    brand: {
      type: mongoose.Schema.ObjectId,
      ref: "StoreBrand",
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
storeProductSchema.virtual("reviews", {
  ref: "StoreReview",
  foreignField: "product",
  localField: "_id",
});

// ^find => it mean if part of of teh word contains find
storeProductSchema.pre(/^find/, function (next) {
  // this => query
  this.populate({
    path: "subCategories",
    select: "title -_id",
  });
  this.populate({
    path: "category",
    select: "title -_id",
  });
  this.populate({
    path: "brand",
    select: "title -_id",
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
  if (doc.pdf) {
    const pdfListWithUrl = [];
    doc.pdf.forEach((pdf) => {
      const pdfUrl = `${process.env.BASE_URL}/store/products/pdf/${pdf}`;
      pdfListWithUrl.push(pdfUrl);
    });
    doc.pdf = pdfListWithUrl;
  }
};
//after initializ the doc in db
// check if the document contains image
// it work with findOne,findAll,update
storeProductSchema.post("init", (doc) => {
  setImageURL(doc);
});
// it work with create
storeProductSchema.post("save", (doc) => {
  setImageURL(doc);
});

const ProductModel = mongoose.model("StoreProduct", storeProductSchema);
module.exports = ProductModel;
