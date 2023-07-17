const asyncHandler = require("express-async-handler");
const ApiError = require("../../utils/apiError");
const Live = require("../../models/educationModel/educationLiveModel");
const factory = require("../handllerFactory");
const sendEmail = require("../../utils/sendEmail");
// Create a new live
exports.createLive = factory.createOne(Live);
//---------------------------------------------------------------------------------//

// Get all lives
exports.getAllLives = factory.getALl(Live);
//---------------------------------------------------------------------------------//

// Get a specific live by ID
exports.getLivebyId = factory.getOne(Live);
//---------------------------------------------------------------------------------//

// Update a live by ID
exports.updateLive = factory.updateOne(Live);
//---------------------------------------------------------------------------------//

// Delete a live  by ID
exports.deleteLive = factory.deleteOne(Live);
//---------------------------------------------------------------------------------//
exports.followLive = asyncHandler(async (req, res, next) => {
  const { liveId } = req.params;
  const live = await Live.findById(liveId);

  if (!live) {
    return next(ApiError("live not found", 404));
  }

  const userIsFollower = live.followers.some(
    (follower) => follower.user.toString() === req.user._id.toString()
  );

  if (userIsFollower) {
    return next(ApiError("you have already followed this live", 400));
  }

  const newFollower = {
    user: req.user._id,
    email: req.user.email,
  };

  live.followers.push(newFollower);
  await live.save();

  res.status(200).json({ succes: "true" });
});
//<----------------------------------->//
exports.SendEmailsToLiveFollwers = asyncHandler(async (req, res, next) => {
  const { liveId } = req.params;
  const live = await Live.findById(liveId);
  if (!live) {
    return next(ApiError("live not found", 404));
  }

  live.followers.forEach(async (follower) => {
    try {
      let emailMessage = "";
      if (req.body.info) {
        emailMessage = `Hi ${follower.email} 
                            \n The Life Is About to Start `;
      }
      emailMessage = `Hi ${follower.email} 
                            \n The Life Is About to Start 
                            \n Here Is Some Information you gonna need 
                            \n ${req.body.info}`;
      await sendEmail({
        to: follower.email,
        subject: "remmeber the live",
        text: emailMessage,
      });
    } catch (err) {
      return next(new ApiError("there is a problem with sending Email", 500));
    }
  });

  res.status(200).json({ succes: "true" });
});
