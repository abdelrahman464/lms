const express = require("express");
const {
  getBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} = require("../../utils/validators/storeValidators/brandValidator");
const authServices = require("../../services/authServices");
const {
  getBrands,
  createBrand,
  getBrand,
  updateBrand,
  deleteBrand,
  uploadCategoryImage,
  resizeImage,
} = require("../../services/storeServices/brandService");

const router = express.Router();

router
  .route("/")
  .get(getBrands)
  .post(
    authServices.protect,
    authServices.allowedTo("admin", "manager"),
    uploadCategoryImage,
    resizeImage,
    createBrandValidator,
    createBrand
  );
router
  .route("/:id")
  .get(getBrandValidator, getBrand)
  .put(
    authServices.protect,
    authServices.allowedTo("admin", "manager"),
    uploadCategoryImage,
    resizeImage,
    updateBrandValidator,
    updateBrand
  )
  .delete(
    authServices.protect,
    authServices.allowedTo("admin"),
    deleteBrandValidator,
    deleteBrand
  );

module.exports = router;
