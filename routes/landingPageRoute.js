const express = require("express");
const authServices = require("../services/authServices");
const{
    createLandingPageVideo,
    getAllLandingPageVideos,
    getLandingPageVideoyId,
    updateLandingPageVideo,
    deleteLandingPageVideo,
    updateDefaultVideo,
    getDeafaultVideo
}=require("../services/landingPageService");


const router=express.Router();

// Create a new video
router.post("/", createLandingPageVideo);
// Get all videos 
router.get("/", getAllLandingPageVideos);

// Get a specific lesson by ID
router.get("/:id", getLandingPageVideoyId);

// Update a lesson by ID
router.put("/:id", updateLandingPageVideo);

// Delete a lesson by ID
router.delete("/:id", deleteLandingPageVideo);
// change selectd vidoe 
router.put("/changeVideo/:videoId",updateDefaultVideo)
//get the default video 
router.get("/defaultVideo", getDeafaultVideo);

module.exports = router;