const asyncHandler = require("express-async-handler");
const LandingPage = require("../models/landingPageModel");
const factory = require("./handllerFactory");

// Create a new landingPage Video
exports.createLandingPageVideo = factory.createOne(LandingPage);
//---------------------------------------------------------------------------------//

// Get all LandingPageVideo
exports.getAllLandingPageVideos = factory.getALl(LandingPage);
//---------------------------------------------------------------------------------//

// Get a specific landingPage Video by ID
exports.getLandingPageVideoyId = factory.getOne(LandingPage);
//---------------------------------------------------------------------------------//

// Update a landingPage Video by ID
exports.updateLandingPageVideo = factory.updateOne(LandingPage);
//---------------------------------------------------------------------------------//

// Delete a landingPage Video by ID
exports.deleteLandingPageVideo = factory.deleteOne(LandingPage);
//---------------------------------------------------------------------------------//

exports.updateDefaultVideo = asyncHandler(async (req, res) => {
  const currentDefaultVideo = await LandingPage.findOne({ isDefault: true });

  if (currentDefaultVideo) {
    currentDefaultVideo.isDefault = false;
    await currentDefaultVideo.save();
  }

  const newDefaultVideo = await LandingPage.findById(req.params.videoId);
  newDefaultVideo.isDefault = true;
  await newDefaultVideo.save();
  res.status(200).json({ status: "switched succesfully" });
});
//---------------------------------------------------------------------------------//
exports.getDeafaultVideo = asyncHandler(async (req, res) => {
  const defaultVideo = await LandingPage.findOne({ isDefault: true });
  res.status(200).json({ vidoe: defaultVideo });
});
