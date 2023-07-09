const asyncHandler = require("express-async-handler");
const ApiError = require("../../utils/apiError");
const Post = require("../../models/analyticModels/analyticPostModel");
const factory = require("../handllerFactory");
const Course = require("../../models/educationModel/educationCourseModel");

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
exports.getALlPosts = factory.getALl(Post);
//@desc get post
//@route GET api/v1/posts/:id
//@access protected user
exports.getPost = factory.getOne(Post);
//@desc delete post
//@route DELTE api/v1/posts:id
//@access protected admin that create the post
exports.deletePost = factory.deleteOne(Post);
