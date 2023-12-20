const SystemReview = require("../models/systemReviewsModel");
const Package = require("../models/educationModel/educationPackageModel");
const factory = require("./handllerFactory");

exports.canReviewSystem = async (req, res, next) => {
  // Check if the logged user has already created a review
  const existingReview = await SystemReview.findOne({
    user: req.user._id,
  });

  if (existingReview) {
    return res
      .status(200)
      .json({ status: "faild", msg: `you already have a review` });
  }
  const package = await Package.findOne({
    user: req.user._id,
    price: { $gte: 100 },
  });

  if (package && package.price >= 100) {
    return next();
  } else {
    return res.status(200).json({
      status: "faild",
      msg: `you should have a packge with 100$ or more `,
    });
  }
};

exports.setUserIdTobody = async (req, res, next) => {
  req.body.user = req.user._id;
  return next();
};
// Create a new landingPage Video
exports.createSystemReview = factory.createOne(SystemReview);
//---------------------------------------------------------------------------------//

// Get all LandingPageVideo
exports.getAllSystemReviews = factory.getALl(SystemReview);
//---------------------------------------------------------------------------------//

// Get a specific landingPage Video by ID
exports.getSystemReview = factory.getOne(SystemReview);
//---------------------------------------------------------------------------------//

// Update a landingPage Video by ID
exports.updateSystemReview = factory.updateOne(SystemReview);
//---------------------------------------------------------------------------------//

// Delete a landingPage Video by ID
exports.deleteSystemReview = factory.deleteOne(SystemReview);
//---------------------------------------------------------------------------------//
exports.getMyReview = async (req, res, next) => {
  // Check if the logged user has already created a review
  const existingReview = await SystemReview.findOne({
    user: req.user._id,
  });

  if (!existingReview) {
    return res
      .status(200)
      .json({ status: "faild", msg: `you don't have a review` });
  }
  return res.status(200).json({ status: "success", data: existingReview });
};
