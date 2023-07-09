const Comment = require("../../models/analyticModels/analyticCommentModel");
const factory = require("../handllerFactory");

//filter comments in specefic post by post id
exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.postId) filterObject = { post: req.params.postId };
  req.filterObj = filterObject;
  next();
};

exports.setUserIdToBody = (req, res, next) => {
  //set user id in the body i will take it from logged user
  req.body.user = req.user._id;
  next();
};
//@desc create a new group
//@route POST /api/v1/postComments
//@access protected user
exports.createComment = factory.createOne(Comment);
//@desc get all comments
//@route GET /api/v1/postComments
//@access protected user
exports.getAllComment = factory.getALl(Comment);
//@desc get comment
//@route GET /api/v1/postComments/:commentId
//@access protected user
exports.getComment = factory.getOne(Comment, "user");
//@desc update comment
//@route POST /api/v1/postComments/:commentId
//@access protected user that created the comment
exports.updateComment = factory.updateOne(Comment);
//@desc delete comment
//@route POST /api/v1/postComments/:commentId
//@access protected user that created the comment
exports.deleteComment = factory.deleteOne(Comment);
