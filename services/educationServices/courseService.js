const asyncHandler = require("express-async-handler");
const Course = require("../../models/educationModel/educationCourseModel");
const factory = require("../handllerFactory");

// middleware to add instructorId to body
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
exports.getCourseById = factory.getOne(Course, "reviews");

// Update a course by ID
exports.updateCourse = factory.updateOne(Course);

// Delete a course by ID
exports.deleteCourse = factory.deleteOne(Course);

exports.relatedCourses = asyncHandler(async (req, res) => {
  const { catId } = req.params;
  const courses = await Course.find({ category: catId });
  res.status(200).json({ data: courses });
});
// to be done when user purchase a course
exports.addUserToCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.body;
  const userId = req.user._id;

  const course = await Course.findById(courseId);

  if (!Course) {
    res.status(400).json({ status: `no package for that id: ${courseId}` });
  }
  const startDate = new Date();

  // Add the user object to the users array
  const newUser = {
    user: userId,
    start_date: startDate,
  };

  course.users.push(newUser);

  await course.save();

  res.status(200).json({ status: "success", course: course });
});

exports.checkCourseAuthority = (req, res, next) =>
  asyncHandler(async (_req, _res, _next) => {
    const userId = req.user.id;
    const { courseId } = req.params;

    const course = await Course.findOne(
      {
        _id: courseId,
        "users.user": userId,
      },
      {
        "users.$": 1, // Select only the matched user object
      }
    );

    if (!course) {
      //check whether has access on courses
      res.json({ msg: "not allowed" });
    }
    // res.json(package)
    next();
  });

//-------------------------------------------------------------------
exports.assignOrderNumbers = async (req, res) => {
  try {
    // Fetch all courses from the database
    const courses = await Course.find();
    // Assign sequential order numbers to courses
    let orderNumber = 1;
    for (const course of courses) {
      course.orderNumber = orderNumber;
      await course.save();
      orderNumber++;
    }

    console.log("Order numbers assigned successfully.");
    return res.status(200).json({ status: "success" });
  } catch (error) {
    console.error("Error assigning order numbers:", error);
  }
};
//----------------------------------------------------------------
exports.updateOrderNumber = async (req, res) => {
    try {
      const { courseId } = req.params;
      const { newOrderNumber } = req.body;
      // Fetch the course that is being updated
      const updatedCourse = await Course.findById(courseId);
  
      // Skip if the course or the orderNumber didn't change
      if (!updatedCourse) {
        return res.status(404).json({ status: "faild", msg: "Course not found" });
      }
  
      // Find the course with the new orderNumber
      const existingCourse = await Course.findOne({
        orderNumber: newOrderNumber,
      });
  
      // If a course with the new orderNumber exists, update its orderNumber
      if (existingCourse) {
        existingCourse.orderNumber = updatedCourse.orderNumber;
        await existingCourse.save();
      }
  
      // Update the orderNumber of the course being updated
      updatedCourse.orderNumber = newOrderNumber;
      await updatedCourse.save();
  
      console.log("Order numbers updated successfully.");
      return res
        .status(200)
        .json({ status: "success", msg: "Order numbers updated successfully" });
    } catch (error) {
      console.error("Error updating order numbers:", error);
      return res
        .status(500)
        .json({ status: "faild", msg: `Internal server error ${error}` });
    }
  }; 
  