const asyncHandler = require("express-async-handler");
const ApiError = require("../../utils/apiError");
const Live = require("../../models/educationModel/educationLiveModel");
const Package = require("../../models/educationModel/educationPackageModel");
const factory = require("../handllerFactory");
const sendEmail = require("../../utils/sendEmail");

//---------------------------------------------------------------------------------------------------//
//@desc this filter lives based on time (8 days ago) and their privillage 
exports.createFilterObj = async (req, res, next) => {
  let filterObject = {};
  // Calculate the date 8 days ago
  const eightDaysAgo = new Date();
  eightDaysAgo.setDate(eightDaysAgo.getDate() - 8);
  

  //1)-if user is admin
  // eslint-disable-next-line no-empty
  if (req.user.role === "admin") {
    return next();
  }
  //2)-if user is the instructor
  else if (req.user.role === "instructor") {
    filterObject = {
      creator: req.user._id,
    };
  } else {
    //3)-get courses they are in and send in filter  3 conditions
    const package = await Package.findOne({
      "users.user": req.user._id,
      "users.end_date": { $gt: new Date() },
    });
    if (!package) {
      res.status(400).json({ msg: "no lives for you" });
    }

    // eslint-disable-next-line no-empty
    else if (package.allCourses === true) {
    } else {
      const coursesArray = package.courses.map((courseId) => courseId);
      filterObject.course = { $in: coursesArray };
    }
  }
    // Filter by date range (updated_at >= eightDaysAgo and updated_at <= current date)
    filterObject.updatedAt = { $gte: eightDaysAgo };
  
  req.filterObj = filterObject;
  // req.selectFields = "field1 field2"; // Add the desired fields to select
  return next();
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
    res.status(400).json({ message: "live not found" });
  }
  //loop over the array to check if any element is me
  const userIsFollower = live.followers.some(
    (follower) => follower.user.toString() === req.user._id.toString()
  );

  if (userIsFollower) {
    res.status(400).json({ message: "you have already followed this live" });
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
  const { id } = req.params;
  const live = await Live.findById(id);
  if (!live) {
    return next(ApiError("live not found", 404));
  }

  live.followers.forEach(async (follower) => {
    try {
      let emailMessage = "";
      if (!req.body.info) {
        emailMessage = `Hi ${follower.email} 
                            \n The Life starts soon , be ready `;
      } else {
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
//---------------------------------------------------------------------------------//
exports.filterFollowedBydate = asyncHandler(async (req, res,next) => {
  let filterObject = {};
  
  const eightDaysAgo = new Date();
  eightDaysAgo.setDate(eightDaysAgo.getDate() - 8);

  const { date } = req.params;
  if(!date){
    filterObject={
      "followers.user": req.user._id
    }
  }else{
    const components = date.split(" ");
    filterObject={
      "followers.user": req.user._id,
      "day": components[2],
      "month": components[1],
    }
  }  
  filterObject.updatedAt = { $gte: eightDaysAgo };

  req.filterObj=filterObject;
    next();
  
  
});




//---------------------------------------------------------------------------------//
exports.myFollowedLives = asyncHandler(async (req, res) => {
  const lives = await Live.find(req.filterObj);

  if (lives.length === 0) {
    res.status(200).json({status:'faild', msg: "you didn't follow any live" });
  } else {
    res.status(200).json({status:'success', data: lives });
  }
});
//---------------------------------------------------------------------------------//
exports.searchByDate = asyncHandler(async (req, res) => {
  const { date } = req.params;
  const components = date.split(" ");
  const lives = await Live.find({
    day: components[2],
    month: components[1],
  });
  if (lives.length === 0) {
    res
      .status(400)
      .json({ status: "faild", msg: "there are no lives for that date" });
  } else {
    res.status(400).json({ status: "success", data: lives });
  }
});
//---------------------------------------------------------------------------------//
exports.createLiveObj = asyncHandler(async (req, res, next) => {
  const { date } = req.body;
  if(date){
    req.body.day = date.split(" ")[2];
    req.body.month = date.split(" ")[1];
    next();
  }
  next();
});
