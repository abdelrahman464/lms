const express = require("express");
const authServices = require("../../services/authServices");

const {
  updatePackageValidator,
  createPackageValidator,
} = require("../../utils/validators/educationValidators/packageValidator");

const {
  createPackage,
  convertToArray,
  createFilterObj,
  getAllPackages,
  getPackageById,
  deletePackage,
  updatePackage,
  addCourseToPlan,
  addUserToPlan,
  getMyPackages,
  resizeImage,
  uploadPackageImage,
  addTelgramIdToUserInPackage,
  getMyChannels,
  removeUserFromPlan,
} = require("../../services/educationServices/packageServices");

const router = express.Router();

//get My packages
router.get("/myPackages", authServices.protect, getMyPackages);
router.get("/myTelegramChannels/:telegramId", getMyChannels);
//add telegram id
router.put("/addTelegramId/:id", addTelgramIdToUserInPackage);
router.post("/addCourseToPlan",authServices.protect, authServices.allowedTo("admin"), addCourseToPlan);

router
  .route("/:type?")
  .get(createFilterObj, getAllPackages)
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
  .route("/addUserToPlan")
  .post(authServices.protect, authServices.allowedTo("admin"), addUserToPlan);
router
  .route("/removeUserFromPlan")
  .post(
    authServices.protect,
    authServices.allowedTo("admin"),
    removeUserFromPlan
  );
module.exports = router;
