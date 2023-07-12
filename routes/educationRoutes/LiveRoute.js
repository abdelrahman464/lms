const express = require("express");
// const authServices = require("../services/authServices");
const{
    createLive,
    getAllLives,
    getLivebyId,
    updateLive,
    deleteLive,
}=require("../../services/educationServices/LiveService");


const router=express.Router();

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


module.exports = router;