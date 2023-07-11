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
      channelNumber: 1,
      chatId: msg.chat.id,
      messageId: msg.message_id,
      text: msg.text,
    });
  });
};
addMessage();
// Add a new message channel 2
const addMessage2 = async () => {
  const bot = new TelegramBot(process.env.TELEGRAM_TOKEN2, {
    polling: true,
  });
  bot.on("message", async (msg) => {
    await TelegramBotMessage.create({
      channelNumber: 2,
      chatId: msg.chat.id,
      messageId: msg.message_id,
      text: msg.text,
    });
  });
};
addMessage2();

//filter posts to get courses posts only
exports.createFilterObj = async (req, res, next) => {
  let filterObject = {};
  // all TELGRAM CHANELES that the logged user is instructor in
  if (req.user.role === "user") {
    filterObject = {
      channelNumber: { $in: req.user.telgramChannels },
    };
  }
  req.filterObj = filterObject;
  next();
};
//@desc get all messaege From bot
//@route GET api/v1/analytic/telegram
//@access protected user,admin
exports.getAllMessages = factory.getALl(TelegramBotMessage);
//@desc get all posts post
//@route GET api/v1/analytic/telegram/:id
//@access protected user,admin
exports.getMessage = factory.getOne(TelegramBotMessage);
