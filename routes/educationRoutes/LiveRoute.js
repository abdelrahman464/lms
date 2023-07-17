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
  createFilterObj
} = require("../../services/educationServices/LiveService");

const router = express.Router();


router.get("/:courseId", authServices.protect,createFilterObj, getAllLives)

router
  .route("/") //middleware    
  .post(authServices.protect, authServices.allowedTo("admin","instructor"), createLive)

router
  .route("/sendEmailsToFollowers/:liveId")
  .post(
    authServices.protect,
    authServices.allowedTo("instructor","admin"),
    SendEmailsToLiveFollwers
  );

router
  .route("/:id")
  .get(authServices.protect,getLivebyId)
  .put(authServices.protect,  authServices.allowedTo("instructor","admin"), updateLive)
  .delete(authServices.protect, authServices.allowedTo("instructor","admin"), deleteLive);

//follow a specific live
router.put(
  "/followLive/:courseId/:liveId",
  authServices.protect,
  authServices.allowedTo("user"),
  checkAuthority2,
  followLive
);
//send emails to followes 

//          middleware-> link 

module.exports = router;
