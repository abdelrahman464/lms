const express = require("express");
const {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  changeUserPasswordValidator,
  updateLoggedUserValidator,
  changeLoggedUserPasswordValidator,
} = require("../utils/validators/userValidator");
const authServices = require("../services/authServices");
const {
  createFilterObj,
  getInstructors,
  getUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  changeUserPassword,
  getLoggedUserData,
  updateLoggedUserPassword,
  updateLoggedUserData,
  deActivateLoggedUser,
  activeateLoggedUser,
  deleteMyAccount,
  uploadProfileImage,
  resizeImage,
  updateUserTelegram,
} = require("../services/userService");

const router = express.Router();

router.get("/getMe", authServices.protect, getLoggedUserData, getUser);
router.put("/deActiveMe", authServices.protect, deActivateLoggedUser);
router.put("/activeMe", authServices.protect, activeateLoggedUser);
router.delete("/deleteMyAcount", authServices.protect, deleteMyAccount);
router.put(
  "/changeMyPassword",
  authServices.protect,
  changeLoggedUserPasswordValidator,
  updateLoggedUserPassword
);
router.get("/instractors", createFilterObj, getInstructors);
router.put(
  "/changeMyData",
  authServices.protect,
  uploadProfileImage,
  resizeImage,
  updateLoggedUserValidator,
  updateLoggedUserData
);
router.put(
  "/changePassword/:id",
  authServices.protect,
  authServices.allowedTo("admin"),
  changeUserPasswordValidator,
  changeUserPassword
);

router
  .route("/")
  .get(authServices.protect, authServices.allowedTo("admin"), getUsers)
  .post(
    authServices.protect,
    authServices.allowedTo("admin"),
    uploadProfileImage,
    resizeImage,
    createUserValidator,
    createUser
  );
router
  .route("/:id")
  .get(
    authServices.protect,
    authServices.allowedTo("admin"),
    getUserValidator,
    getUser
  )
  .put(
    authServices.protect,
    uploadProfileImage,
    resizeImage,
    updateUserValidator,
    updateUser
  )
  .delete(
    authServices.protect,
    authServices.allowedTo("admin"),
    deleteUserValidator,
    deleteUser
  );

router.post("/updateUserTelegram/:userId", updateUserTelegram);

module.exports = router;
