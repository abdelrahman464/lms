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
  createFilterObjAllowedPosts,
  createFilterObjHomePosts,
  getLoggedUserAllowedPosts,
  getPost,
  updatePost,
  deletePost,
  uploadPostImage,
  resizeImage,
  getHomePosts,
} = require("../../services/analyticServices/postServices");

const router = express.Router();
// merged routes
router.use("/:postId/postComments", postCommentRoute);
router.use("/:postId/postReacts", postReactRoute);

router
  .route("/")
  .get(
    authServices.protect,
    authServices.allowedTo("user", "instructor", "admin"),
    createFilterObjAllowedPosts,
    getLoggedUserAllowedPosts
  )
  .post(
    authServices.protect,
    authServices.allowedTo("instructor", "admin"),
    uploadPostImage,
    resizeImage,
    createPostValidator,
    createPost
  );
router.get(
  "/home",
  authServices.protect,
  authServices.allowedTo("user", "instructor", "admin"),
  createFilterObjHomePosts,
  getHomePosts
);
router
  .route("/:id")
  .get(
    authServices.protect,
    authServices.allowedTo("user", "instructor", "admin"),
    getPostValidator,
    getPost
  )
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
