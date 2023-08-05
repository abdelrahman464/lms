const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const Story = require("../models/storiesModel");
const factory = require("./handllerFactory");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");

//upload Singel image
exports.uploadStoryImage = uploadSingleImage("image");
//image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `story-${uuidv4()}-${Date.now()}.jpeg`;

  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/story/${filename}`);
    //save image into our db
    req.body.image = filename;
  }

  next();
});
// Create a new Story
exports.createStory = factory.createOne(Story);
//---------------------------------------------------------------------------------//

// Get all Story
exports.getAllStories = factory.getALl(Story);
//---------------------------------------------------------------------------------//

// Get a specific by ID
exports.getStory = factory.getOne(Story);
//---------------------------------------------------------------------------------//

// Update a Story by ID
exports.updateStory = factory.updateOne(Story);
//---------------------------------------------------------------------------------//

// Delete a Story by ID
exports.deleteStory = factory.deleteOne(Story);
//---------------------------------------------------------------------------------//
