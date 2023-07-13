const { check } = require("express-validator");
const validatorMiddleware = require("../../../middlewares/validatorMiddleware");
const Course = require("../../../models/educationModel/educationCourseModel");
const Package = require("../../../models/educationModel/educationPackageModel");

exports.checkAuthority2 = [
  check("courseId")
    .isMongoId()
    .withMessage("Invalid courseId")
    .custom(
      (courseId, { req }) =>
        new Promise((resolve, reject) => {
          // Check if the user has a subscription for the course
          Package.findOne({
            courses: courseId,
            "users.user": req.user._id,
            "users.end_date": { $gt: new Date() },
          })
            .then((package) => {
              if (package) {
                // User has an active subscription for the course
                resolve();
              } else {
                // Check if the user has paid for the course or is the instructor
                Course.findOne({
                  _id: courseId,
                  $or: [
                    { "users.user": req.user._id },
                    { instructor: req.user._id },
                  ],
                })
                  .then((course) => {
                    if (course) {
                      // User has either paid for the course or is the instructor of the course
                      resolve();
                    } else {
                      // User does not have the necessary authority
                      reject(new Error("Access denied"));
                    }
                  })
                  .catch((error) => {
                    reject(error);
                  });
              }
            })
            .catch((error) => {
              reject(error);
            });
        })
    ),
  validatorMiddleware,
];
