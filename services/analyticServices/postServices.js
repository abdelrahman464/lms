const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const Post = require("../../models/analyticModels/analyticPostModel");
const factory = require("../handllerFactory");
const {
  uploadSingleImage,
} = require("../../middlewares/uploadImageMiddleware");

//upload Single image
exports.uploadPostImage = uploadSingleImage("image");
//image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `post-${uuidv4()}-${Date.now()}.jpeg`;

  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/analytic/posts/${filename}`);

    //save image into our db
    req.body.image = filename;
  }

  next();
});
//filter to get public posts only
exports.createFilterObjPosts = async (req, res, next) => {
  let filterObject = { sharedTo: "public" };
  if (req.params.sharedTo) {
    filterObject = { sharedTo: req.params.sharedTo };
  }
  req.filterObj = filterObject;
  next();
};
//-------------------------------------------------------------------------------------------------
//@desc create post
//@route POST api/v1/posts
//@access protected user
exports.createPost = asyncHandler(async (req, res, next) => {
  const { content, image, sharedTo } = req.body;
  // Create a new post
  const post = new Post({
    user: req.user._id,
    content,
    image,
    sharedTo,
  });

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
exports.getPosts = factory.getALl(Post);
//@desc get post
//@route GET api/v1/posts/:id
//@access protected user
exports.getPost = factory.getOne(Post);
//@desc delete post
//@route DELTE api/v1/posts:id
//@access protected admin that create the post
exports.deletePost = factory.deleteOne(Post);

//@desc get home posts
//@route GET api/v1/posts/home
//@access protected user
exports.getHomePosts = factory.getALl(Post);
