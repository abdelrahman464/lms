const TelegramChannel = require("../models/telegramChannelsModel");

const factory = require("./handllerFactory");

// Create a new TelegramChannel
exports.createTelegramChannel = factory.createOne(TelegramChannel);
//---------------------------------------------------------------------------------//

// Get all Story
exports.getAllTelegramChannels = factory.getALl(TelegramChannel);
//---------------------------------------------------------------------------------//

// Get a specific by ID
exports.getTelegramChannel = factory.getOne(TelegramChannel);
//---------------------------------------------------------------------------------//

// Update a TelegramChannel by ID
exports.updateTelegramChannel = factory.updateOne(TelegramChannel);
//---------------------------------------------------------------------------------//

// Delete a TelegramChannel by ID
exports.deleteTelegramChannel = factory.deleteOne(TelegramChannel);
//---------------------------------------------------------------------------------//
