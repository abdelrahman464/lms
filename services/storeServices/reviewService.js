const asyncHandler = require("express-async-handler");
const Review = require("../../models/storeModels/reviewModel");
const factory = require("../handllerFactory");
const ApiError = require("../../utils/apiError");

// GET products/:productId/reviews
exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.productId) filterObject = { product: req.params.productId };
  req.filterObj = filterObject;
  next();
};
//@desc get list of Review
//@route GET /api/v1/reviews
//@access public
exports.getReviews = factory.getALl(Review);
//@desc get specific Review by id
//@route GET /api/v1/reviews/:id
//@access public
exports.getReview = factory.getOne(Review);
//nested route
exports.setProductIdAndUserIdToBody = (req, res, next) => {
  //Nested Route
  if (!req.body.product) req.body.product = req.params.productId;
  //if you didn't send i user id in the body i will take it from logged user
  //logged user
  if (!req.body.user) req.body.user = req.user._id;
  next();
};
//@desc create Review
//@route POST /api/v1/reviews
//@access private/protect/user
exports.createReview = factory.createOne(Review);
//@desc update specific Review
//@route PUT /api/v1/reviews/:id
//@access private/protect/user
exports.updateReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!review) {
    return next(new ApiError(`No review For this id ${req.params.id}`, 404));
  }
  //trigger "save" event when update the document
  review.save();
  res.status(200).json({ data: review });
});
//@desc delete Review
//@route DELETE /api/v1/reviews/:id
//@access private/protect/user-admin-manager
exports.deleteReview = factory.deleteOne(Review);
