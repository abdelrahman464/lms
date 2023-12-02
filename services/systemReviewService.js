const SystemReview = require("../models/systemReviewsModel");
const factory = require("./handllerFactory");


exports.setUserIdTobody=async(req,res,next)=>{
    req.body.user=req.user._id ;
    return next();

}
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