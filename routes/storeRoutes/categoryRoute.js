const express = require("express");

const {
  getCategoryValidator,
  createCategroyValidator,
  updateCategroyValidator,
  deleteCategroyValidator,
} = require("../../utils/validators/storeValidators/categoryValidator");
const authServices = require("../../services/authServices");
const {
  getCategories,
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
  resizeImage,
} = require("../../services/storeServices/categoryService");

const subCategoryRoute = require("./subCategoryRoute");

const router = express.Router();

router.use("/:categoryId/subcategories", subCategoryRoute);

router
  .route("/")
  .get(getCategories)
  .post(
    authServices.protect,
    authServices.allowedTo("admin", "manager"),
    uploadCategoryImage,
    resizeImage,
    createCategroyValidator,
    createCategory
  );
router
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .put(
    authServices.protect,
    authServices.allowedTo("admin", "manager"),
    uploadCategoryImage,
    resizeImage,
    updateCategroyValidator,
    updateCategory
  )
  .delete(
    authServices.protect,
    authServices.allowedTo("admin"),
    deleteCategroyValidator,
    deleteCategory
  );

module.exports = router;
