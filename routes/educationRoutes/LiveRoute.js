const express = require("express");
const authServices = require("../../services/authServices");
const {checkAuthority2}=require("../../utils/validators/educationValidators/lessonsValidator")
const {
  createLive,
  getAllLives,
  getLivebyId,
  updateLive,
  deleteLive,
  followLive,
} = require("../../services/educationServices/LiveService");

const router = express.Router();

// Create a new video
router.post("/", createLive);
// Get all videos
router.get("/", getAllLives);

// Get a specific lesson by ID
router.get("/:id", getLivebyId);

// Update a lesson by ID
router.put("/:id", updateLive);

// Delete a lesson by ID
router.delete("/:id", deleteLive);
//follow a specific live
router.put("/followLive/:courseId/:liveId",
 authServices.protect,
 checkAuthority2,
 followLive);

module.exports = router;
