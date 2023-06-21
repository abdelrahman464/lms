const mongoose = require("mongoose");

const telegramBotMessageSchema = new mongoose.Schema({
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
  telegramBotMessageSchema
);

module.exports = TelegramBotMessage;
