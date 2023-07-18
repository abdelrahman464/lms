const express = require("express");
const authServices = require("../../services/authServices");

const {
  updatePackageValidator,
  createPackageValidator} =require("../../utils/validators/educationValidators/packageValidator")

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

router.route("/").get(getAllPackages).post(createPackageValidator, createPackage);

router
  .route("/:id")
  .get(getPackageById)
  .put(updatePackageValidator,updatePackage)
  .delete(deletePackage);

router.route("/addCourseToPlan").post(addCourseToPlan)  
router.route("/addUserToPlan").post(authServices.protect,addUserToPlan)  

module.exports = router;
