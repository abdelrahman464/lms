const asyncHandler = require("express-async-handler");
const User = require("../../models/userModel");

//@desc add address to user address list
//@route POST /api/v1/addresses
//@access protected/user
exports.addAddress = asyncHandler(async (req, res, next) => {
  //add address object to user addresses array id address not exist
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { addresses: req.body },
    },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    message: "address added successfully",
    data: user.addresses,
  });
});

//@desc remove address from user addresses list
//@route DELETE /api/v1/addresses/:addressId
//@access protected/user
exports.removeAddressFromAddressList = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      //remove an address from addresses list array if exists
      $pull: { addresses: { _id: req.params.addressId } },
    },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    message: "address removed successfully ",
    data: user.addresses,
  });
});
//@desc get logged user wishlist
//@route GET /api/v1/wishlist
//@access protected/user
exports.getLoggedUseraddresses = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("addresses");

  res.status(200).json({
    status: "success",
    result: user.addresses.length,
    data: user.addresses,
  });
});
