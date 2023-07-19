const express = require("express");
const authServices = require("../../services/authServices");

const {
  updatePackageValidator,
  createPackageValidator,
} = require("../../utils/validators/educationValidators/packageValidator");

const {
  createPackage,
  convertToArray,
  getAllPackages,
  getPackageById,
  deletePackage,
  updatePackage,
  addCourseToPlan,
  addUserToPlan,
  getMyPackages,
  resizeImage,
  uploadPackageImage,
} = require("../../services/educationServices/packageServices");

const router = express.Router();

//get My packages
router.get("/myPackages", authServices.protect, getMyPackages);

router
  .route("/")
  .get(getAllPackages)
  .post(
    uploadPackageImage,
    resizeImage,
    convertToArray,
    createPackageValidator,
    createPackage
  );

router
  .route("/:id")
  .get(getPackageById)
  .put(
    authServices.protect,
    authServices.allowedTo("admin"),
    uploadPackageImage,
    resizeImage,
    convertToArray,
    updatePackageValidator,
    updatePackage
  )
  .delete(
    authServices.protect,
    authServices.allowedTo("admin"),
    convertToArray,
    deletePackage
  );

router
  .route("/addCourseToPlan")
  .post(authServices.protect, authServices.allowedTo("admin"), addCourseToPlan);

router
  .route("/addUserToPlan")
  .post(authServices.protect, authServices.allowedTo("admin"), addUserToPlan);

module.exports = router;
