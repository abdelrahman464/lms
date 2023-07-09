const express = require("express");
const {
  deleteCommentValidator,
  updateCommentValidator,
  createCommentValidator
} = require("../../utils/validators/analyticValidators/postCommentValidator");
const authServices = require("../../services/authServices");

const {
  createComment,
  getComment,
  getAllComment,
  deleteComment,
  updateComment,
  createFilterObj,
  setUserIdToBody
} = require("../../services/analyticServices/commentOnPostServices");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(
    authServices.protect,
    authServices.allowedTo("user"),
    setUserIdToBody,
    createCommentValidator,
    createComment
  )
  .get(
    authServices.protect,
    authServices.allowedTo("user", "admin"),
    createFilterObj,
    getAllComment
  );
router
  .route("/:id")
  .get(
    authServices.protect,
    authServices.allowedTo("user", "admin"),
    getComment
  )
  .put(
    authServices.protect,
    authServices.allowedTo("user"),
    updateCommentValidator,
    updateComment
  )
  .delete(
    authServices.protect,
    authServices.allowedTo("user", "admin"),
    deleteCommentValidator,
    deleteComment
  );

module.exports = router;
