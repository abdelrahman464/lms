const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const Comment = require("../../models/analyticModels/analyticCommentModel");
const factory = require("../handllerFactory");
const {
  uploadSingleImage,
} = require("../../middlewares/uploadImageMiddleware");

//upload Single image
exports.uploadCommentImage = uploadSingleImage("image");
//image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `comment-${uuidv4()}-${Date.now()}.jpeg`;

  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/analytic/commentPost/${filename}`);

    //save image into our db
    req.body.image = filename;
  }

  next();
});
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


//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
exports.replyToComment =async (req, res) => {
  const { commentId } = req.params;
  const { userId, content } = req.body;

  try {
    // Find the comment to which you want to reply
    const parentComment = await Comment.findById(commentId);

    // Check if the parent comment exists
    if (!parentComment) {
      return res.status(404).json({ error: 'Parent comment not found' });
    }

    // Create a new reply
    const reply = {
      user:userId,
      content,
    };

    // Add the reply to the parent comment
    parentComment.repiles.push(reply);

    // Save the parent comment with the new reply
    await parentComment.save();

    return res.status(201).json({status:"succes",parentComment});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

//---------------------------------------------------------------------------------------------
exports.editReplyComment=async(req, res) => {

  const { replyId } = req.params;
  const { content } = req.body;

  try {
    // Find the comment that contains the reply
    const parentComment = await Comment.findOne({
      'repiles._id': replyId,
    });

    // Check if the parent comment exists
    if (!parentComment) {
      return res.status(404).json({ error: 'Parent comment not found' });
    }

    // Find the reply within the parent comment
    const reply = parentComment.repiles.id(replyId);

    // Check if the reply exists
    if (!reply) {
      return res.status(404).json({ error: 'Reply not found' });
    }

    // Update the reply content
    reply.content = content;

    // Save the parent comment with the updated reply
    await parentComment.save();

    return res.status(200).json({statis:"success",parentComment});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }

}
//---------------------------------------------------------------------------------------------
exports.deleteReplyComment=async(req, res) => {

  const { replyId } = req.params;

  try {
    // Find the comment that contains the reply
    const parentComment = await Comment.findOne({
      'repiles._id': replyId,
    });

    // Check if the comment with the reply exists
    if (!parentComment) {
      return res.status(404).json({ error: 'Comment with reply not found' });
    }

    // Find the specific reply within the comment
    const reply = parentComment.repiles.id(replyId);

    // Check if the reply exists
    if (!reply) {
      return res.status(404).json({ error: 'Reply not found' });
    }

    // Remove the reply from the comment
    reply.remove();

    // Save the comment without the deleted reply
    await parentComment.save();

    return res.status(200).json({status:`successfully deleted`});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }

}