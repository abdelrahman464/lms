const TelegramBot = require("node-telegram-bot-api");
const TelegramBotMessage = require("../../models/analyticModels/telgramBotModel");
const factory = require("../handllerFactory");

// Add a new message
const addMessage = async () => {
  const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, {
    polling: true,
  });
  bot.on("message", async (msg) => {
    await TelegramBotMessage.create({
      chatId: msg.chat.id,
      messageId: msg.message_id,
      text: msg.text,
    });
  });
};
addMessage();
//@desc get all messaege From bot
//@route GET api/v1/analytic/telegram
//@access protected user,admin
exports.getAllMessages = factory.getALl(TelegramBotMessage);
//@desc get all posts post
//@route GET api/v1/analytic/telegram/:id
//@access protected user,admin
exports.getMessage = factory.getOne(TelegramBotMessage);
