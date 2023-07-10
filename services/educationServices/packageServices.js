const Package = require("../../models/educationModel/educationPackageModel");
const factory = require("../handllerFactory");
const asyncHandler = require("express-async-handler");
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

exports.addCourseToPlan=asyncHandler(async(req,res)=>{

  const {planId,courseId}=req.body;

  const plan = await Package.findById(planId);
  
  if (!plan) {
    res.status(400).json({status:`no package for that id: ${planId}`})
  }
   // Add the courseId to the courses array
   plan.courses.push(courseId);

   await plan.save();

   res.json(200).json({status:"success"});
})


// to be done when user purchase a package 
exports.addUserToPlan=asyncHandler(async(req,res)=>{

  const {planId}=req.body;
  const userId="64a481a2d936b5330c9dd3e1"//req.user._id

  const plan = await Package.findById(planId);
  
  if (!plan) {
    res.status(400).json({status:`no package for that id: ${planId}`})
  }
  const startDate = new Date();
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + plan.expirationTime);
   // Add the user object to the users array
   const newUser = {
    user: userId,
    start_date: startDate,
    end_date: endDate
  };

   plan.users.push(newUser);

   await plan.save();

   res.json(200).json({status:"success"});
})

//middleware to check user Authority to courses 
exports.checkCourseAuthority=asyncHandler(async(req,res,next)=>{
  try {
  const userId=req.user.id;
  const planId = req.user.plan;
  const courseId=req.params.courseId;


 const package = await Package.findOne({
      courses: { $in: [courseId] },
      'users.user': userId,
      'users.end_date': { $gte: new Date() }
    });

    if (!package) {
      return res.status(403).json({ error: 'Access denied' });
    }
    next();
  }catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }

})


//create route for add course to plan 
//create route for add user to plan 
//add middleware that Validate user  *

// create categories 
// create courses 
// create sections 
// create lessons 

