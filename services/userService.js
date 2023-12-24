const bcrypt = require("bcryptjs");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const factory = require("./handllerFactory");
const User = require("../models/userModel");
const generateToken = require("../utils/generateToken");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");

//upload Singel image
exports.uploadProfileImage = uploadSingleImage("profileImg");
//image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;

  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("png")
      .jpeg({ quality: 95 })
      .toFile(`uploads/users/${filename}`);

    //save image into our db
    req.body.profileImg = filename;
  }

  next();
});
//filter user to get instractors
exports.createFilterObj = async (req, res, next) => {
  const filterObject = { role: "instructor" };
  req.filterObj = filterObject;
  next();
};
//@desc get list of user
//@route GET /api/v1/users
//@access private
exports.getUsers = factory.getALl(User);
//@desc get specific User by id
//@route GET /api/v1/User/:id
//@access private
exports.getUser = factory.getOne(User);
//@desc create user
//@route POST /api/v1/users
//@access private
exports.createUser = factory.createOne(User);
//@desc get all instructors
//@route Get /api/v1/users/instractors
//@access public
exports.getInstructors = factory.getALl(User);
//@desc update specific user
//@route PUT /api/v1/user/:id
//@access private
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      role: req.body.role,
      about: req.body.about,
      profileImg: req.body.profileImg,
      country:req.body.country
    },
    {
      new: true,
    }
  );
  if (!user) {
    return next(new ApiError(`User Not Found`, 404));
  }

  res.status(200).json({ data: user });
});
//@desc chang user password
//@route PUT /api/v1/user/changePassword/:id
//@access private admin
exports.changeUserPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );
  if (!user) {
    return next(new ApiError(`User Not Found`, 404));
  }
  res.status(200).json({ data: user });
});
//@desc delete User
//@route DELETE /api/v1/user/:id
//@access private
exports.deleteUser = factory.deleteOne(User);
//@desc get logged user data
//@route GET /api/v1/user/getMe
//@access private/protect
exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
  // i will set the req,pararms.id because i will go to the next middleware =>>> (getUser)
  req.params.id = req.user._id;
  next();
});
//@desc update logged user password
//@route PUT /api/v1/user/changeMyPassword
//@access private/protect
exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
  //update user password passed on user payload (req.user._id)
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );
  //genrate token
  const token = generateToken(req.user._id);

  res.status(200).json({ data: user, token });
});
//@desc update logged user data without updating password or role
//@route PUT /api/v1/user/changeMyData
//@access private/protect
exports.updateLoggedUserData = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      phone: req.body.phone,
      about: req.body.about,
      profileImg: req.body.profileImg,
      country:req.body.country
    },
    {
      new: true,
    }
  );
  res.status(200).json({ data: user });
});
//@desc deactivate logged user
//@route PUT /api/v1/user/deActiveMe
//@access private/protect
exports.deActivateLoggedUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });
  res.status(201).json({ data: "success" });
});
//@desc activate logged user
//@route PUT /api/v1/user/activeMe
//@access private/protect
exports.activeateLoggedUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: true });
  res.status(201).json({ data: "success" });
});
//@desc delete my acount
//@route PUT /api/v1/user/deleteMyAcount
//@access private/protect user
exports.deleteMyAccount = asyncHandler(async (req, res, next) => {
  await User.findByIdAndDelete(req.user._id);
  res.status(204).send();
});
