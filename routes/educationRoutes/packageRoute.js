const express = require("express");
const {
  createPackage,
  convertToArray,
  getAllPackages,
  getPackageById,
  deletePackage,
  updatePackage,
} = require("../../services/educationServices/packageServices");

const router = express.Router();

router.route("/").get(getAllPackages).post(convertToArray, createPackage);

router
  .route("/:id")
  .get(getPackageById)
  .put(updatePackage)
  .delete(deletePackage);

module.exports = router;
