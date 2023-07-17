const express = require("express");
const authServices = require("../../services/authServices");
const {
  checkAuthority2,
} = require("../../utils/validators/educationValidators/lessonsValidator");
const {
  createLive,
  getAllLives,
  getLivebyId,
  updateLive,
  deleteLive,
  followLive,
  SendEmailsToLiveFollwers,
} = require("../../services/educationServices/LiveService");

const router = express.Router();

router
  .route("/")
  .post(authServices.protect, authServices.allowedTo("user"), createLive)
  .get(authServices.protect, authServices.allowedTo("user"), getAllLives);
router
  .route("/sendEmailsToFollowers/:liveId")
  .post(
    authServices.protect,
    authServices.allowedTo("user"),
    SendEmailsToLiveFollwers
  );

router
  .route("/:id")
  .get(authServices.protect, authServices.allowedTo("user"), getLivebyId)
  .put(authServices.protect, authServices.allowedTo("user"), updateLive)
  .delete(authServices.protect, authServices.allowedTo("user"), deleteLive);

//follow a specific live
router.put(
  "/followLive/:courseId/:liveId",
  authServices.protect,
  authServices.allowedTo("user"),
  checkAuthority2,
  followLive
);

module.exports = router;
