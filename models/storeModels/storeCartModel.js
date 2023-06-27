const mongoose = require("mongoose");

const storeCartStoreSchema = mongoose.Schema(
  {
    cartItems: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: "StoreProduct",
        },
        quantity: {
          type: Number,
          default: 1,
        },
        color: String,
        price: Number,
      },
    ],
    totalCartprice: Number,
    totalCartpriceAfterDiscount: Number,
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// ^find => it mean if part of of teh word contains find

storeCartStoreSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name -_id",
  });
  this.populate({
    path: "cartItems",
    populate: "product",
  });
  next();
});

module.exports = mongoose.model("StoreCart", storeCartStoreSchema);
