const asyncHandler = require("express-async-handler");
const ApiError = require("../../utils/apiError");
const Live = require("../../models/educationModel/educationLiveModel");
const Package=require("../../models/educationModel/educationPackageModel")
const factory = require("../handllerFactory");
const sendEmail = require("../../utils/sendEmail");


//---------------------------------------------------------------------------------------------------//
exports.createFilterObj = async(req, res, next) => {
  let filterObject = {};
  //1)-if user is admin 
  // eslint-disable-next-line no-empty
  if(req.user.role==="admin"){ }
  //2)-if user is the instructor 
  else if(req.user.role==="instructor"){
    filterObject={
      creator:req.user._id
    }; 
  }
  else{ 
  //3)-get courses they are in and send in filter  3 conditions
  const package=await Package.findOne({
    "users.user":req.user._id,
    "users.end_date": { $gt: new Date() },
  })
    if(!package){
      res.status(400).json({msg:"no lives for you"})
    }

    // eslint-disable-next-line no-empty
    else if(package.allCourses === true ){  }
    else {
      const coursesArray = package.courses.map(courseId => courseId.toString());
      filterObject.course = { $in: coursesArray };
    }
  }

  req.filterObj = filterObject;
  // req.selectFields = "field1 field2"; // Add the desired fields to select
  next();
};
//---------------------------------------------------------------------------------------------------//
exports.setCreatorIdToBody = (req, res, next) => {
  req.body.creator = req.user._id;
  next();
};
//---------------------------------------------------------------------------------------------------//
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
      if (!req.body.info) {
        emailMessage = `Hi ${follower.email} 
                            \n The Life starts soon , be ready `;
      }else{ 
      emailMessage = `Hi ${follower.email} 
                            \n The Life starts soon , be ready
                            \n Here Is Some Information you might need 
                            \n ${req.body.info}`;
      }
      await sendEmail({
        to: follower.email,
        subject: `remmeber the live ${live.title}`,
        text: emailMessage,
      });
    } catch (err) {
      return next(new ApiError("there is a problem with sending Email", 500));
    }
  });

  res.status(200).json({ succes: "true" });
});
