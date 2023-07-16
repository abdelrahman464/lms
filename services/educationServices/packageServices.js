const asyncHandler = require("express-async-handler");
const Package = require("../../models/educationModel/educationPackageModel");
const factory = require("../handllerFactory");
const { checkCourseAuthority } = require("./courseService");


exports.convertToArray = async (req, res, next) => {
  if (req.body.courses) {
    // If it's not an array, convert it to an array
    if (!Array.isArray(req.body.courses)) {
      req.body.courses = [req.body.courses];
    }
  }
  next();
};
// Create a new package
exports.createPackage = factory.createOne(Package);
// Get all packages
exports.getAllPackages = factory.getALl(Package);
// Get a specific package by ID
exports.getPackageById = factory.getOne(Package);
// Update a package by ID
exports.updatePackage = factory.updateOne(Package);
// Delete a package by ID
exports.deletePackage = factory.deleteOne(Package);

exports.addCourseToPlan = asyncHandler(async (req, res) => {
  const { planId, courseId } = req.body;

  const plan = await Package.findById(planId);

  if (!plan) {
    res.status(400).json({ status: `no package for that id: ${planId}` });
  }
  // Add the courseId to the courses array
  plan.courses.push(courseId);

  await plan.save();

  res.status(200).json({ status: "success" });
});

// to be done when user purchase a package
//old version 
exports.addUserToPlan = asyncHandler(async (req, res) => {
  const { planId } = req.body; //params
  const userId = req.user._id;
  const plan = await Package.findById(planId);
  
  if (!plan) {
    res.status(400).json({ status: `no package for that id: ${planId}` });
  }
  
  const startDate = new Date();
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + plan.expirationTime);
  // Add the user object to the users array
  const newUser = {
    user: userId,
    start_date: startDate,
    end_date: endDate,
  };

  plan.users.push(newUser);

  await plan.save();

  res.status(200).json({ status: "success", plan: plan });
});
// lessons courses
//middleware to check user Authority to courses
exports.checkAuthority = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const { courseId } = req.params;

  const package = await Package.findOne(

    {
      courses: { $in: [courseId] },
      "users.user": userId,
    },
    {
      "users.$": 1, // Select only the matched user object
    }
  );

  if (!package) {
    //course    user
    //check whether has access on courses
    checkCourseAuthority(req,res,next);

    return res.status(403).json({ error: "Access denied" }); //Api Error
  }
  // res.json(package)
  const user = package.users[0];
  const bool =
    new Date(user.start_date).getTime() < new Date(user.end_date).getTime();

  if (!bool) {
    // User's start date is not valid, delete the user object from the users array
    await Package.updateOne(
      { _id: package._id }, // Identify the document by its unique identifier
      { $pull: { users: { _id: user._id } } } // Specify the field and the element to remove
    );

    res.status(403).json({ error: "your subscription expired " });
  } else {
    // User has authority, proceed to the next middleware
    next();
  }
});
// exports.checkCourseAuthority=asyncHandler(async(req,res,next)=>{
//   try {
//   const userId=req.user.id;
//   const planId = req.user.plan;
//   const courseId=req.params.courseId;

//  const package = await Package.findOne({
//       courses: { $in: [courseId] },
//       'users.user': userId,
//       'users.end_date': {  $lt: new Date() }
//     });
//     if (!package) {
//       return res.status(403).json({ error: 'Access denied' });
//     }

//     next();
//   }catch (error) {
//     res.status(500).json({ error: 'An error occurred' });
//   }

// })

// const checkCourseAuthority2 = async (req, res, next) => {
//   const userId = req.user.id;
//   const { courseId } = req.params;

// const course = await Course.findOne(
//     {
//       _id: courseId,
//       "users.user": userId,
//     },
//     {
//       "users.$": 1, // Select only the matched user object
//     }
//   );

//   if (!course) {
//     //check whether has access on courses
//     res.json({ msg: "not allowed" });
//   }
//   // res.json(package)
//   next();
// };

// exports.checkCourseAuthority = () =>
//   asyncHandler(async (req, res, next) => {
//     const userId = req.user.id;
//     const { courseId } = req.params;

//     const course = await Course.findOne(
//       {
//         _id: courseId,
//         "users.user": userId,
//       },
//       {
//         "users.$": 1, // Select only the matched user object
//       }
//     );

//     if (!course) {
//       //check whether has access on courses
//       res.json({ msg: "not allowed" });
//     }
//     // res.json(package)
//     next();
//   });
