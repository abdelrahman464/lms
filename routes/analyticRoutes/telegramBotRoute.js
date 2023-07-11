const express = require("express");
const authServices = require("../../services/authServices");
const {
  getAllMessages,
  getMessage,
  createFilterObj,
} = require("../../services/analyticServices/telegramBotServiecs");

const router = express.Router();
router
  .route("/")
  .get(
    authServices.protect,
    authServices.allowedTo("user", "admin"),
    createFilterObj,
    getAllMessages
  );
router
  .route("/:id")
  .get(
    authServices.protect,
    authServices.allowedTo("user", "admin"),
    getMessage
  );

module.exports = router;
