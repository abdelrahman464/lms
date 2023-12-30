const express = require("express");
const postCommentRoute = require("./postCommentRoute");
const postReactRoute = require("./postReactRoute");

const {
  processPostValidator,
  createPostValidator,
  getPostValidator,
} = require("../../utils/validators/analyticValidators/postValidator");
const authServices = require("../../services/authServices");
const {
  createPost,
  createFilterObjPosts,
  getPosts,
  getPost,
  updatePost,
  deletePost,
  uploadPostImage,
  resizeImage,
} = require("../../services/analyticServices/postServices");

const router = express.Router();
// merged routes
router.use("/:postId/postComments", postCommentRoute);
router.use("/:postId/postReacts", postReactRoute);

router
  .route("/")
  .get( createFilterObjPosts, getPosts)
  .post(
    authServices.protect,
    authServices.allowedTo("instructor", "admin"),
    uploadPostImage,
    resizeImage,
    createPostValidator,
    createPost
  );
router
  .route("/:id")
  .get(getPostValidator, getPost)
  .put(
    authServices.protect,
    authServices.allowedTo("instructor", "admin"),
    uploadPostImage,
    resizeImage,
    processPostValidator,
    updatePost
  )
  .delete(
    authServices.protect,
    authServices.allowedTo("instructor", "admin"),
    processPostValidator,
    deletePost
  );

module.exports = router;
