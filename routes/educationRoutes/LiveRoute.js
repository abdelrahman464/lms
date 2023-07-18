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
  createFilterObj,
  setCreatorIdToBody
} = require("../../services/educationServices/LiveService");
// Validation 
const{checkLiveAuthority}=require("../../utils/validators/educationValidators/liveValidator")

const router = express.Router();

//create   admin  instructor of course 
//update delete admin instructorof course 
//send emails to students 
router.get("/:courseId", authServices.protect,createFilterObj, getAllLives)

router
  .route("/") //middleware    
  .post(authServices.protect, authServices.allowedTo("admin","instructor"),setCreatorIdToBody,createLive)

router
  .route("/sendEmailsToFollowers/:liveId")
  .post(
    authServices.protect,
    authServices.allowedTo("instructor","admin"),
    checkLiveAuthority,
    SendEmailsToLiveFollwers
  );

router
  .route("/:liveId")
  .get(authServices.protect,checkLiveAuthority,getLivebyId)
  .put(authServices.protect,  authServices.allowedTo("instructor","admin"), checkLiveAuthority,updateLive)
  .delete(authServices.protect, authServices.allowedTo("instructor","admin"), checkLiveAuthority ,deleteLive);

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
