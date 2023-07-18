const { check } = require("express-validator");
const validatorMiddleware = require("../../../middlewares/validatorMiddleware");
const ApiError = require("../../apiError");
const Live = require("../../../models/educationModel/educationLiveModel");
//delete | update | follow  
exports.checkLiveAuthority=[
    check("liveId")
    .notEmpty()
    .withMessage("send courseId in param please")
    .isMongoId()
    .withMessage("Invalid courseId")
    .custom((liveId,{req})=>
        new Promise((resolve, reject) => {
            if(req.user.role==="admin"){
                resolve();
            }
            Live.findOne({
                _id: liveId,
                creator: req.user._id ,
                
              })
                .then((live) => {
                  if (live) {
                    // User is the instructor of the course
                    resolve();
                  } else {
                    // User does not have the necessary authority
                    reject(new Error("Access denied"));
                  }
                })
                .catch((error) => {
                  reject(new Error(error));
                });
        })

    )

,
validatorMiddleware
]