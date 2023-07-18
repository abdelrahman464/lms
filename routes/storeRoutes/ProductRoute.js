const express = require("express");
const {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../../utils/validators/storeValidators/productValidator");
const authServices = require("../../services/authServices");
const {
  getProducts,
  createFilterObjMyProducts,
  getMyProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  resizeProductImages,
  convertToArray,
} = require("../../services/storeServices/productService");

// nested routes
const reviewsRoute = require("./reviewRoute");

const router = express.Router();

router.use("/:productId/reviews", reviewsRoute);

router.get(
  "/MyProducts",
  authServices.protect,
  authServices.allowedTo("user"),
  createFilterObjMyProducts,
  getMyProducts
);
router
  .route("/")
  .get(getProducts)
  .post(
    authServices.protect,
    authServices.allowedTo("admin"),
    uploadProductImages,
    resizeProductImages,
    convertToArray,
    createProductValidator,
    createProduct
  );
router
  .route("/:id")
  .get(
    authServices.protect,
    authServices.allowedTo("user"),
    getProductValidator,
    createFilterObjMyProducts,
    getProduct
  )
  .put(
    authServices.protect,
    authServices.allowedTo("admin"),
    uploadProductImages,
    resizeProductImages,
    convertToArray,
    updateProductValidator,
    updateProduct
  )
  .delete(
    authServices.protect,
    authServices.allowedTo("admin"),
    deleteProductValidator,
    deleteProduct
  );

module.exports = router;
