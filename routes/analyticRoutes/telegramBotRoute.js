const express = require("express");
const authServices = require("../../services/authServices");
const {
  getAllMessages,
  getMessage,
} = require("../../services/analyticServices/telegramBotServiecs");

const router = express.Router();
router
  .route("/")
  .get(
    authServices.protect,
    authServices.allowedTo("user", "admin"),
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
