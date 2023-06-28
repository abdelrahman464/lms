const mongoose = require("mongoose");
const Product = require("./storeProductModel");
//1- create schema
const storeReviewSchema = mongoose.Schema(
  {
    title: {
      type: "String",
    },
    ratings: {
      type: Number,
      min: [1, "min value is 1.0"],
      max: [5, "max value is 5.0"],
      required: [true, "review ratings required"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "review must belong to user"],
    },
    // parent references (1 - many)
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "StoreProduct",
      required: [true, "review must belong to product"],
    },
  },
  { timestamps: true }
);

// any query containe find
storeReviewSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name profileImg" });
  next();
});

storeReviewSchema.statics.calcAverageRatingsAndQuantity = async function (
  productId
) {
  const result = await this.aggregate([
    // Stage 1 : get all reviews in specific product
    {
      $match: { product: productId },
    },
    // Stage 2: Grouping reviews based on productID and calc avgRatings, ratingsQuantity
    {
      $group: {
        _id: "product",
        avgRatings: { $avg: "$ratings" },
        ratingsQuantity: { $sum: 1 },
      },
    },
  ]);

  if (result.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: result[0].avgRatings,
      ratingsQuantity: result[0].ratingsQuantity,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: 0,
      ratingsQuantity: 0,
    });
  }
};
//this function is called when i delete a review
storeReviewSchema.post("remove", async function () {
  await this.constructor.calcAverageRatingsAndQuantity(this.product);
});
//this function is called when i save a review
storeReviewSchema.post("save", async function () {
  await this.constructor.calcAverageRatingsAndQuantity(this.product);
});

//2- create model
const StoreReviewModel = mongoose.model("StoreReview", storeReviewSchema);

module.exports = StoreReviewModel;
