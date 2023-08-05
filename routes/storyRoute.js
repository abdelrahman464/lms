const express = require("express");
const authServices = require("../services/authServices");
const{
    createStory,
    getAllStories,
    getStory,
    updateStory,
    deleteStory
   
}=require("../services/storyService");


const router=express.Router();

// Create a new video
router.post("/", createStory);
// Get all videos 
router.get("/", getAllStories);

// Get a specific lesson by ID
router.get("/:id", getStory);

// Update a lesson by ID
router.put("/:id", updateStory);

// Delete a lesson by ID
router.delete("/:id", deleteStory);


module.exports = router;