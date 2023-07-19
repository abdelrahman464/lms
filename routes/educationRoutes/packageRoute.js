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
} = require("../../services/educationServices/packageServices");

const router = express.Router();

router
  .route("/")
  .get(getAllPackages)
  .post(convertToArray, createPackageValidator, createPackage);

router
  .route("/:id")
  .get(getPackageById)
  .put(
    authServices.protect,
    authServices.allowedTo("admin"),
    convertToArray,
    updatePackageValidator,
    updatePackage
  )
  .delete(authServices.allowedTo("admin"), convertToArray, deletePackage);

router
  .route("/addCourseToPlan")
  .post(authServices.protect, authServices.allowedTo("admin"), addCourseToPlan);

router
  .route("/addUserToPlan")
  .post(authServices.protect, authServices.allowedTo("admin"), addUserToPlan);

module.exports = router;
