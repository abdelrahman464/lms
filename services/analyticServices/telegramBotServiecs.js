const TelegramBot = require("node-telegram-bot-api");
const TelegramBotMessage = require("../../models/analyticModels/analyticTelgramBotModel");
const factory = require("../handllerFactory");


// Add a new message channel 1
const addMessage = async () => {
  const bot = new TelegramBot(process.env.TELEGRAM_TOKEN1, {
    polling: true,
  });
  bot.on("message", async (msg) => {
    await TelegramBotMessage.create({
      channelName: "telegram_1",
      chatId: msg.chat.id,
      messageId: msg.message_id,
      text: msg.text,
    });
  });
};
// addMessage();
// Add a new message channel 2
const addMessage2 = async () => {
  const bot = new TelegramBot(process.env.TELEGRAM_TOKEN2, {
    polling: true,
  });
  bot.on("message", async (msg) => {
    await TelegramBotMessage.create({
      channelName: "telegram_2",
      chatId: msg.chat.id,
      messageId: msg.message_id,
      text: msg.text,
    });
  });
};
// addMessage2();
exports.createFilterObj = async (req, res, next) => {
  const filterObject = {
    channelName: req.params.channelName,
  };

  req.filterObj = filterObject;
  next();
};

//@desc get all messaege From bot
//@route GET api/v1/analytic/telegram/: channelName? (optional)
//@access protected user,admin
exports.getAllMessages = factory.getALl(TelegramBotMessage);

//@desc get all posts post
//@route GET api/v1/analytic/telegram/:id
//@access protected user,admin
exports.getMessage = factory.getOne(TelegramBotMessage);
