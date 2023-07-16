const express = require("express");
const authServices = require("../../services/authServices");
const {
  getAllMessages,
  getMessage,
  createFilterObj,
} = require("../../services/analyticServices/telegramBotServiecs");

const {checkAuthority3}=require("../../utils/validators/analyticValidators/telegramValidator");

const router = express.Router();
router
  .route("/:channelName")
  .get(
    authServices.protect,
    authServices.allowedTo("user", "admin"),
    createFilterObj,
    checkAuthority3,
    getAllMessages
  ); //
router
  .route("/:id")
  .get(
    authServices.protect,
    authServices.allowedTo("user", "admin"),
    getMessage
  );  

module.exports = router;
