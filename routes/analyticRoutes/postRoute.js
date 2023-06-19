const express = require("express");
const postCommentRoute = require("./postCommentRoute");
const postReactRoute = require("./postReactRoute");

const {
  processPostValidator,
} = require("../../utils/validators/analyticValidators/postValidator");
const authServices = require("../../services/authServices");
const {
  createPost,
  getALlPosts,
  getPost,
  updatePost,
  deletePost,
} = require("../../services/analyticServices/postServices");

const router = express.Router();
// merged routes
router.use("/:postId/postComments", postCommentRoute);
router.use("/:postId/postReacts", postReactRoute);

router
  .route("/")
  .get(
    authServices.protect,
    authServices.allowedTo("user", "admin"),
    getALlPosts
  )
  .post(authServices.protect, authServices.allowedTo("admin"), createPost);
router
  .route("/:id")
  .get(authServices.protect, authServices.allowedTo("user", "admin"), getPost)
  .put(
    authServices.protect,
    authServices.allowedTo("admin"),
    processPostValidator,
    updatePost
  )
  .delete(
    authServices.protect,
    authServices.allowedTo("admin"),
    processPostValidator,
    deletePost
  );

module.exports = router;
