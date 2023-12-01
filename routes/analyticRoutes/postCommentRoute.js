const express = require("express");
const {
  deleteCommentValidator,
  updateCommentValidator,
  getCommentValidator,
  createCommentValidator,
} = require("../../utils/validators/analyticValidators/postCommentValidator");
const authServices = require("../../services/authServices");

const {
  uploadCommentImage,
  resizeImage,
  createComment,
  getComment,
  getAllComment,
  deleteComment,
  updateComment,
  createFilterObj,
  setUserIdToBody,
  replyToComment,
  editReplyComment,
  deleteReplyComment
} = require("../../services/analyticServices/commentOnPostServices");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(
    authServices.protect,
    authServices.allowedTo("user", "instructor", "admin"),
    uploadCommentImage,
    resizeImage,
    setUserIdToBody,
    createCommentValidator,
    createComment
  )
  .get(
    authServices.protect,
    authServices.allowedTo("user", "admin", "instructor"),
    createFilterObj,
    getAllComment
  );
router
  .route("/:id")
  .get(
    authServices.protect,
    authServices.allowedTo("user", "admin", "instructor"),
    getCommentValidator,
    getComment
  )
  .put(
    authServices.protect,
    authServices.allowedTo("user", "instructor", "admin"),
    uploadCommentImage,
    resizeImage,
    updateCommentValidator,
    updateComment
  )
  .delete(
    authServices.protect,
    authServices.allowedTo("user", "admin", "instructor"),
    deleteCommentValidator,
    deleteComment
  );

router.route("/replyToComment/:commentId").put(authServices.protect,authServices.allowedTo("admin"),replyToComment);
router.route("/editReplyComment/:replyId").put(authServices.protect,authServices.allowedTo("admin"),editReplyComment);
router.route("/deleteReplyComment/:replyId").delete(authServices.protect,authServices.allowedTo("admin"),deleteReplyComment);

module.exports = router;
