const Live=require("../../models/educationModel/educationLiveModel");
const factory=require("../handllerFactory");


// Create a new live
exports.createLive= factory.createOne(Live);
//---------------------------------------------------------------------------------//

// Get all lives
exports.getAllLives = factory.getALl(Live);
//---------------------------------------------------------------------------------//

// Get a specific live by ID
exports.getLivebyId = factory.getOne(Live);
//---------------------------------------------------------------------------------//

// Update a live by ID
exports.updateLive= factory.updateOne(Live);
//---------------------------------------------------------------------------------//

// Delete a live  by ID
exports.deleteLive= factory.deleteOne(Live);
//---------------------------------------------------------------------------------//