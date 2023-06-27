const asyncHandler = require("express-async-handler");
const ApiError = require("../../utils/apiError");
const Post = require("../../models/analyticModels/analyticPostModel");
const User = require("../../models/userModel");
const factory = require("../handllerFactory");

//@desc create post
//@route POST api/v1/posts
//@access protected user
exports.createPost = asyncHandler(async (req, res, next) => {
  const { content } = req.body;
  const userId = req.user._id;

  // Create a new post
  const post = new Post({
    user: userId,
    content,
  });
  //check user exists and push the post id in user
  const user = await User.findById(userId);
  if (!user) {
    return next(new ApiError(`User not found`, 404));
  }
  user.posts.push(post._id);
  await user.save();

  await post.save();
  res.status(201).json({ success: true, data: post });
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
