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
  setCreatorIdToBody,
  myFollowedLives,
} = require("../../services/educationServices/LiveService");
// Validation
const {
  checkLiveAuthority,
  createLiveValidator,
  updateLiveValidator,
} = require("../../utils/validators/educationValidators/liveValidator");

const router = express.Router();

// get myFollowed Lives 
router.get("/myFollowedLives", authServices.protect, myFollowedLives);
//create   admin  instructor of course
//update delete admin instructorof course
//send emails to students
router.get("/:courseId?", authServices.protect, createFilterObj, getAllLives);

router
.route("/") //middleware
.post(
  authServices.protect,
  authServices.allowedTo("admin", "instructor"),
  createLiveValidator,
  setCreatorIdToBody,
  createLive
  );
  
  router
  .route("/sendEmailsToFollowers/:liveId")
  .post(
    authServices.protect,
    authServices.allowedTo("instructor", "admin"),
    checkLiveAuthority,
    SendEmailsToLiveFollwers
  );

router
  .route("/:id")
  .get(authServices.protect, checkLiveAuthority, getLivebyId)
  .put(
    authServices.protect,
    authServices.allowedTo("instructor", "admin"),
    checkLiveAuthority,
    updateLiveValidator,
    updateLive
  )
  .delete(
    authServices.protect,
    authServices.allowedTo("instructor", "admin"),
    checkLiveAuthority,
    deleteLive
  );

//follow a specific live
router.put(
  "/followLive/:courseId/:liveId",
  authServices.protect,
  authServices.allowedTo("user","admin"),
  checkAuthority2,
  followLive
);
//get my lives plz


module.exports = router;
