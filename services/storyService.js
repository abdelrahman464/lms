const asyncHandler = require("express-async-handler");
const Story = require("../models/storiesModel");
const factory = require("./handllerFactory");

// Create a new Story
exports.createStory = factory.createOne(Story);
//---------------------------------------------------------------------------------//

// Get all Story
exports.getAllStories = factory.getALl(Story);
//---------------------------------------------------------------------------------//

// Get a specific landingPage Video by ID
exports.getStory = factory.getOne(Story);
//---------------------------------------------------------------------------------//

// Update a Story Video by ID
exports.updateStory = factory.updateOne(Story);
//---------------------------------------------------------------------------------//

// Delete a Story Video by ID
exports.deleteStory = factory.deleteOne(Story);
//---------------------------------------------------------------------------------//