const asyncHandler = require("express-async-handler");
const Course = require("../../models/educationModel/educationCourseModel");
const factory = require("../handllerFactory");
// middleware to add categoryId to body
exports.setinstructorIdToBody = (req, res, next) => {
  req.body.instructor = req.user._id;
  next();
};

//filter subCategories in specefic category by categoryId
exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) filterObject = { category: req.params.categoryId };
  req.filterObj = filterObject;
  next();
};
// Create a new course
exports.createCourse = factory.createOne(Course);

// Get all courses
exports.getAllCourses = factory.getALl(Course);

// Get a specific course by ID
exports.getCourseById = factory.getOne(Course, "EducationSection");

// Update a course by ID
exports.updateCourse = factory.updateOne(Course);

// Delete a course by ID
exports.deleteCourse = factory.deleteOne(Course);

exports.relatedCourses=asyncHandler(async(req,res)=>{
  const {catId}=req.params;
  const courses=  await Course.find({category:catId});
  res.status(200).json({data:courses});
  
})
// to be done when user purchase a course  
exports.addUserToCourse=asyncHandler(async(req,res)=>{

  const {courseId}=req.body;
  const userId=req.user._id;

  const course = await Course.findById(courseId);
  
  if (!Course) {
    res.status(400).json({status:`no package for that id: ${courseId}`})
  }
  const startDate = new Date();
  const endDate = new Date();;
   // Add the user object to the users array
   const newUser = {
    user: userId,
    start_date: startDate,
    end_date: endDate
  };

   course.users.push(newUser);

   await course.save();

   res.status(200).json({status:"success",course:course});
})

exports.checkCourseAuthority=asyncHandler(async(req,res,next)=>{
  
  const userId=req.user.id;
  const {courseId} = req.params;


  const course = await Course.findOne({
    '_id':courseId,
    'users.user': userId,
    },
    {
    'users.$': 1 // Select only the matched user object
    }); 
  
    if (!course) {
      //check whether has access on courses 
    //  res.json(sadsad);
    }
    // res.json(package)
     next()
  

})
