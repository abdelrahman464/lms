const express = require("express");
const authServices = require("../../services/authServices");

const {
  createPackage,
  convertToArray,
  getAllPackages,
  getPackageById,
  deletePackage,
  updatePackage,
  addCourseToPlan,
  addUserToPlan
} = require("../../services/educationServices/packageServices");

const router = express.Router();

router.route("/").get(getAllPackages).post(convertToArray, createPackage);

router
  .route("/:id")
  .get(getPackageById)
  .put(updatePackage)
  .delete(deletePackage);

router.route("/addCourseToPlan").post(addCourseToPlan)  
router.route("/addUserToPlan").post(authServices.protect,addUserToPlan)  

module.exports = router;
