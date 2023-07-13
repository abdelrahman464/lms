const asyncHandler = require("express-async-handler");
const ApiError = require("../../utils/apiError");
const Post = require("../../models/analyticModels/analyticPostModel");
const factory = require("../handllerFactory");
const Course = require("../../models/educationModel/educationCourseModel");
const Package = require("../../models/educationModel/educationPackageModel");

// package = req.user.package
// package.courses

// course  [users]

exports.createFilterObj = async (req, res, next) => {
  let filterObject = {};

  if (req.user.role === "user") {
    // all courses that the logged user is subscripe in
    const courses = await Course.find({ "users.user": req.user._id });
    const userPackages = await Package.find({
      "users.user": req.user._id,
      "users.end_date": { $gt: new Date() },
    });

    const courseIds = courses.map((course) => course._id.toString());
    const coursePackageIds = userPackages.map((package) => package.courses);

    const coursesFromPackages = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const nestedArray of coursePackageIds) {
      const flattenedArray = nestedArray.flat();
      const uniqueElements = new Set(
        flattenedArray.map((element) => element.toString())
      );
      coursesFromPackages.push(...uniqueElements);
    }
    const userCourses = Array.from(
      new Set([...coursesFromPackages, ...courseIds])
    );

    filterObject = {
      $or: [
        {
          sharedTo: "course",
          course: { $in: userCourses },
        },
        {
          sharedTo: "public",
        },
      ],
    };
  }
  if (req.user.role === "instructor") {
    // all courses that the logged user is instructor in
    const courses = await Course.find({ instructor: req.user._id });
    const courseIds = courses.map((course) => course._id);

    filterObject = {
      $or: [
        {
          sharedTo: "course",
          course: { $in: courseIds },
        },
        {
          sharedTo: "public",
        },
      ],
    };
  }
  req.filterObj = filterObject;
  next();
};
//@desc create post
//@route POST api/v1/posts
//@access protected user
exports.createPost = asyncHandler(async (req, res, next) => {
  const { content, course } = req.body;
  // Create a new post
  const post = new Post({
    user: req.user._id,
    content,
    course,
  });

  //check group exists and push the post id in course
  if (course) {
    const currentCourse = await Course.findById(course);
    if (!currentCourse) {
      return next(new ApiError(`Course not found`, 404));
    }
    currentCourse.posts.push(post._id);
    await currentCourse.save();
    post.sharedTo = "course";
  }
  await post.save();
  res.status(201).json({ success: true, post });
});

//@desc update post
//@route PUT api/v1/posts/:id
//@access protected admin that create the post
exports.updatePost = factory.updateOne(Post);
//@desc get all posts post
//@route GET api/v1/posts
//@access protected user,admin
exports.getLoggedUserAllowedPosts = factory.getALl(Post);
//@desc get post
//@route GET api/v1/posts/:id
//@access protected user
exports.getPost = factory.getOne(Post);
//@desc delete post
//@route DELTE api/v1/posts:id
//@access protected admin that create the post
exports.deletePost = factory.deleteOne(Post);
