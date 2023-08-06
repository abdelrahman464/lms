const mongoose = require("mongoose");

const storeOrderStoreSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "order must be belong to user"],
    },
    cartItems: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: "StoreProduct",
        },
        quantity: Number,
        price: Number,
      },
    ],
    taxPrice: {
      type: Number,
      default: 0,
    },
    totalOrderPrice: {
      type: Number,
    },
    paymentMethodType: {
      type: String,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: Date,
  },
  { timestamp: true }
);

storeOrderStoreSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name phone email " }).populate({
    path: "cartItems.product",
    select: "title imageCover category",
  });
  next();
});

module.exports = mongoose.model("StoreOrder", storeOrderStoreSchema);
