const express = require("express");
const authServices = require("../services/authServices");
const {
  createTelegramChannel,
  getAllTelegramChannels,
  getTelegramChannel,
  updateTelegramChannel,
  deleteTelegramChannel,
} = require("../services/telegramChannelsService");

const router = express.Router();

// Create a getTelegramChannel
router.post(
  "/",
  authServices.protect,
  authServices.allowedTo("admin"),
  createTelegramChannel
);
// Get all getTelegramChannels
router.get("/", getAllTelegramChannels);

// Get a specific getTelegramChannel by ID
router.get("/:id", getTelegramChannel);

// Update a lesson by ID
router.put(
  "/:id",
  authServices.protect,
  authServices.allowedTo("admin"),
  updateTelegramChannel
);

// Delete a lesson by ID
router.delete(
  "/:id",
  authServices.protect,
  authServices.allowedTo("admin"),
  deleteTelegramChannel
);

module.exports = router;
