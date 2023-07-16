const { check } = require("express-validator");
const validatorMiddleware = require("../../../middlewares/validatorMiddleware");
const ApiError = require("../../apiError");
const Package = require("../../../models/educationModel/educationPackageModel");

exports.checkAuthority3 = [
    check("channelName")
      .notEmpty()
      .withMessage("channelName is reuired :)")
      .isString()
      .withMessage("Invalid channelName")
      .custom(
        (channelName, { req }) =>
          new Promise((resolve, reject) => {
            //if he is an admin 
            if(req.user.role==="admin"){
              resolve();
            }
            // Check if the user has a subscription for the course
            Package.findOne({
                telegramChannelNames: {$in : [channelName, "*"]}, //
              // eslint-disable-next-line no-underscore-dangle
              "users.user": req.user._id,
              "users.end_date": { $gt: new Date() }, // subscribtion not expired   
            })
              .then((package) => {
                if (package) {
                  // User has an active subscription for the course
                  resolve();
                } else {
                  // Check if the user has paid for the course or is the instructor
                  reject(new Error("Access Denied "));
                   
                }
              })
              .catch((error) => {
                reject(new Error(error));
              });
          })
      ),
    validatorMiddleware,
  ];