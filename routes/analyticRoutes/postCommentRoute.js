const express = require("express");
const {
  processCommentValidator,
} = require("../../utils/validators/analyticValidators/postCommentValidator");
const authServices = require("../../services/authServices");

const {
  createComment,
  getComment,
  getAllComment,
  deleteComment,
  updateComment,
  createFilterObj,
} = require("../../services/analyticServices/commentOnPostServices");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(authServices.protect, authServices.allowedTo("user"), createComment)
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
    processCommentValidator,
    updateComment
  )
  .delete(
    authServices.protect,
    authServices.allowedTo("user", "admin"),
    processCommentValidator,
    deleteComment
  );

module.exports = router;
