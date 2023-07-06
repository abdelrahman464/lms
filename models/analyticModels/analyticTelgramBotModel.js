const mongoose = require("mongoose");

const analyticTelegramBotMessageSchema = new mongoose.Schema({
  channelNumber: {
    type: Number,
    required: true,
  },
  chatId: {
    type: Number,
    required: true,
  },
  messageId: {
    type: Number,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const TelegramBotMessage = mongoose.model(
  "TelegramBotMessage",
  analyticTelegramBotMessageSchema
);

module.exports = TelegramBotMessage;
