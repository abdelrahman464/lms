const mongoose = require("mongoose");

const telegramChannelsSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true,
  }, 
});

const TelegramChannel = mongoose.model("telegramChannels", telegramChannelsSchema);

module.exports = TelegramChannel;
