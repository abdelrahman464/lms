const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const ActiveSession=require("../models/activeSessionModel")
const ApiError = require("../utils/apiError");
const sendEmail = require("../utils/sendEmail");
const generateToken = require("../utils/generateToken");

//@desc signup
//@route POST /api/v1/auth/signup
//@access public
exports.signup = asyncHandler(async (req, res, next) => {
  //1-create user
  const user = await new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    active: false,
    phone:req.body.phone,
    country:req.body.country
  });
  //generate verification code
  const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedVerifyCode = crypto
    .createHash("sha256")
    .update(verifyCode)
    .digest("hex");
  //save hashed email verification code
  user.emailVerifyCode = hashedVerifyCode;
  //add expiration time  for email verify code (10min)
  user.emailVerifyExpires = Date.now() + 10 * 60 * 1000;
  user.emailVerified = false;

  const token = generateToken(user._id);
  await user.save();
  //3-send the Verification code via email
  try {
    const emailMessage = `Hi ${user.name}, 
                         \n ${verifyCode} 
                         \n enter this code to complete the verification 
                         \n thanks for helping us keep your account secure.
                         \n the E-Website Team`;
    await sendEmail({
      to: user.email,
      subject: "Your Verification code (valid for 10 min)",
      text: emailMessage,
    });
  } catch (err) {
    user.emailVerifyCode = undefined;
    user.emailVerifyExpires = undefined;
    user.emailVerified = undefined;

    await user.save();
    return next(
      new ApiError(
        "there is a problem with sending Email with your Verification code",
        500
      )
    );
  }

  res.status(201).json({ data: user, token });
});
//@desc generate Verify Code
//@route GET /api/v1/auth/sendVerifyCode
//@access protected
exports.generateVerifyCode = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return next(new ApiError("User Not Found", 404));
  }
  if (user.emailVerified === true) {
    return next(new ApiError("Email ALready verified ", 401));
  }
  //generate verification code
  const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedVerifyCode = crypto
    .createHash("sha256")
    .update(verifyCode)
    .digest("hex");
  //save hashed email verification code
  user.emailVerifyCode = hashedVerifyCode;
  //add expiration time  for email verify code (10min)
  user.emailVerifyExpires = Date.now() + 10 * 60 * 1000;
  user.emailVerified = false;

  await user.save();
  //3-send the Verification code via email

  try {
    const emailMessage = `Hi ${user.name}, 
                         \n ${verifyCode} 
                         \n enter this code to complete the verification 
                         \n thanks for helping us keep your account secure.
                         \n the E-Website Team`;
    await sendEmail({
      to: user.email,
      subject: "Your Verification code (valid for 10 min)",
      text: emailMessage,
    });
  } catch (err) {
    user.emailVerifyCode = undefined;
    user.emailVerifyExpires = undefined;
    user.emailVerified = undefined;

    await user.save();
    return next(
      new ApiError(
        "there is a problem with sending Email with your Verification code",
        500
      )
    );
  }

  res.status(200).json({ succes: "true" });
});
//@desc verfy email
//@route POST /api/v1/auth/verifyEmail
//@access public
exports.verifyEmail = asyncHandler(async (req, res, next) => {
  //1-get user passed on verify code
  const hashedVerifyCode = crypto
    .createHash("sha256")
    .update(req.body.verifyCode)
    .digest("hex");

  const user = await User.findOne({
    emailVerifyCode: hashedVerifyCode,
    //check if the verify code is valid
    // if verify code expire date greater than Data.now() then reset code is valid
    emailVerifyExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ApiError("verification code invalid or expired"));
  }
  //2- verify code is valid
  user.emailVerified = true;
  user.active = true;
  user.emailVerifyCode = undefined;
  user.emailVerifyExpires = undefined;
  user.emailVerified = true;
  await user.save();

  //3- generate token
  const token = generateToken(user._id);
  //3- send response to client side
  res.status(200).json({ data: user, token });
});
//@desc login
//@route POST /api/v1/auth/login
//@access public
exports.login = asyncHandler(async (req, res, next) => {
  //1-Check if user can login  [only 2 devices]
  const devices=await ActiveSession.find({email:req.body.email});
  if(devices.length >=2){
    res.status(400).json({status:"faild",msg:`you cannot login from more the 2 devices`})
  }
  else{ 
  //2- check if password and emaail in the body
  const user = await User.findOne({ email: req.body.email });
  //3- check if user exist & check if password is correct
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError("incorrect password or email", 401));
  }
  //4- generate token
  const token = generateToken(user._id);
  //5- store active session
  await ActiveSession.create({email:req.body.email,token:token});
  //6- send response to client side
  res.status(200).json({ data: user, token });
}
});

//@desc make sure user is logged in
exports.protect = asyncHandler(async (req, res, next) => {
  //1- check if token exists, if exist get it
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new ApiError("you are not login,please login first", 401));
  }
  let decoded;
  //2- verify token (no change happens,expired token)
  try {
  decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); //paylod  //error 

  //3-check if user exists
  const currentUser = await User.findById(decoded.userId);
  if (!currentUser) {
    next(new ApiError("user is not available"));
  }
  //4-check if user changed password after token generated
  if (currentUser.passwordChangedAt) {
    //convert data to timestamp by =>getTime()
    const passwordChangedTimestamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10
    );
    //it mean password changer after token generated
    if (passwordChangedTimestamp > decoded.iat) {
      return next(
        new ApiError(
          "user recently changed his password,please login again",
          401
        )
      );
    }
  }

  req.user = currentUser;

  next();
}
 catch (error) {
  if (error instanceof jwt.TokenExpiredError) {
    // The token has expired
    console.log('Token expired');
    // Now, you can delete the document from the ActiveSession model where token matches the expired token
    const result = await ActiveSession.deleteOne({ token: token });
    if (result.deletedCount === 1) {
      console.log('Expired token deleted successfully');
     }
    else {
      console.log('Token not found or not deleted');
   }
    res.status(400).json({status:`faild`,msg:`token expired`})

  } else if (error instanceof jwt.JsonWebTokenError) {
    // The token is invalid or malformed
    console.log('Invalid token');
    res.status(400).json({status:`faild`,msg:`invalid token`})
  } else {
    // Other errors
    console.log('Error while verifying token:');
    res.status(400).json({status:`faild`,msg:`'Error while verifying token: ${error.message}`});
  }
}
});
//@desc  Authorization (user permissions)
// ....roles => retrun array for example ["admin","user"]
exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    //1- access roles
    //2- access registered user (req.user.role)
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError("you are not allowed to access this route", 403)
      );
    }
    next();
  });
//@desc forgot password
//@route POST /api/v1/auth/forgotPassword
//@access public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  //1-Get user by email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    next(new ApiError(`there is no user with email ${req.body.email}`, 404));
  }
  //2-if user exists hash generate random 6 digits and save it in database
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");
  //save hashed password reset code
  user.passwordResetCode = hashedResetCode;
  //add expiration time  for password reset code (10min)
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false;

  await user.save();

  //3-send the reset code via email
  try {
    const emailMessage = `Hi ${user.name},
                          \n we recived a request to reset your password on your E-shop Account. 
                          \n ${resetCode} 
                          \n enter this code to complete the reset 
                          \n thanks for helping us keep your account secure.
                          \n the E-shop Team`;
    await sendEmail({
      to: user.email,
      subject: "Your Password Reset code (valid for 10 min)",
      text: emailMessage,
    });
  } catch (err) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;

    await user.save();
    return next(
      new ApiError(
        "there is a problem with sending Email with your reset code",
        500
      )
    );
  }
  res.status(200).json({
    status: "success",
    message: `Reset Code Sent Success To ${user.email}`,
  });
});
//@desc verify reset password code
//@route POST /api/v1/auth/verifyResetCode
//@access public
exports.verifyPassResetCode = asyncHandler(async (req, res, next) => {
  //1-get user passed on reset code
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");
  const user = await User.findOne({
    passwordResetCode: hashedResetCode,
    //check if the reset code is valid
    // if reset code expire date greater than Data.now() then reset code is valid
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ApiError("reset code invalid or expired"));
  }
  //2- reset code is valid
  user.passwordResetVerified = true;
  await user.save();

  res.status(200).json({ status: "success" });
});
//@desc  reset password
//@route PUT /api/v1/auth/resetPassword
//@access public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  //1-get user by email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ApiError(`there is no user with that email ${req.body.email}`, 404)
    );
  }
  //2- check is reset code is verifyed
  if (!user.passwordResetVerified) {
    return next(new ApiError(`Reset code not verified`, 400));
  }
  user.password = req.body.newPassword;
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = undefined;

  await user.save();

  //3- if every thing is okay
  //generate token
  const token = generateToken(user._id);
  res.status(200).json({ token });
});





exports.logout = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(400).json({ status: 'failed', msg: 'Token not provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // Token is valid, proceed with logout
    const result = await ActiveSession.deleteOne({ token: token });
    if (result.deletedCount === 1) {
      console.log('Expired token deleted successfully');
    } else {
      console.log('Token not found or not deleted');
    }
    res.status(200).json({ status: 'success', msg: 'Logged out successfully' });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      // Token is already expired
      console.log('Token expired');
      res.status(400).json({ status: 'failed', msg: 'Token already expired' });
    } else if (error instanceof jwt.JsonWebTokenError) {
      // Invalid token
      console.log('Invalid token');
      res.status(400).json({ status: 'failed', msg: 'Invalid token' });
    } else {
      // Other errors
      console.log('Error while verifying token:', error);
      res.status(500).json({ status: 'failed', msg: `Error while verifying token: ${error.message}` });
    }
  }
};

