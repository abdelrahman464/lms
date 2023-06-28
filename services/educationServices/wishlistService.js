const asyncHandler = require("express-async-handler");
const User = require("../../models/userModel");
const ApiError = require("../../utils/apiError");

//@desc add Course to wishlist
//@route POST /api/v1/wishlist
//@access protected/user
exports.addCourseToWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      // add item to array
      // if you tying to add an item to wishlist and this item is already existing $addToSet will be ignored
      $addToSet: { educationWishlist: req.body.courseId },
    },
    { new: true }
  );
  if (!user) {
    return ApiError("no prodcut found", 404);
  }
  res.status(200).json({
    status: "success",
    message: "Course added successfully to your wishlist",
    data: user.educationWishlist,
  });
});

//@desc remove Course from wishlist
//@route DELETE /api/v1/wishlist/:courseId
//@access protected/user
exports.removeCourseFromWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      //remove an item from wish list array if exists
      $pull: { educationWishlist: req.params.courseId },
    },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    message: "Course removed successfully from your wishlist",
    data: user.educationWishlist,
  });
});
//@desc get logged user wishlist
//@route GET /api/v1/wishlist
//@access protected/user
exports.getLoggedUserWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("educationWishlist");

  res.status(200).json({
    status: "success",
    result: user.educationWishlist.length,
    data: user.educationWishlist,
  });
});
