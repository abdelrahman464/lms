const mongoose = require("mongoose");

//when return his unDirect transaction
//loop on this array and return his total profits
//calculate his total
const MarketingLogsSchema = new mongoose.Schema(
  {
    marketer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    hasSentRequest: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["customer", "marketer"],
    },
    //we will use this when update brokers of marketer
    invitor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    bonous: {
      type: Number,
      default: 0,
    },
    totalSalesMoneyGT500: {
      type: Number,
      default: 0,
    },
    totalSalesMoneyLT500: {
      type: Number,
      default: 0,
    },
    percentageGT500: {
      type: Number,
      default: 0,
    },
    percentageLT500: {
      type: Number,
      default: 0,
    },
    profitsGT500: {
      type: Number,
      default: 0,
    },
    profitsLT500: {
      type: Number,
      default: 0,
    },
    transactionsGT500: [
      {
        child: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        amount: Number,
        package: String,
        packageType: String,
        Date: {
          type: Date,
          default: Date.now(),
        },
      },
    ],
    transactionsLT500: [
      {
        child: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        amount: Number,
        package: String,
        packageType: String,
        Date: {
          type: Date,
          default: Date.now(),
        },
      },
    ],
    //when we pay to marketer we save invoice here
    invoices: [
      {
        bonous: Number,
        totalSalesMoneyGT500: Number,
        totalSalesMoneyLT500: Number,
        mySalesGT500: Number,
        mySalesLT500: Number,
        percentageGT500: Number,
        percentageLT500: Number,
        profitsGT500: Number,
        profitsLT500: Number,
        desc: String,
        Date: {
          type: Date,
          default: Date.now(),
        },
        status: {
          type: String,
          Enum: ["unpaid", "pending", "paid"],
          default: "unpaid",
        },
        //these two parameters
        paymentMethod: {
          type: String,
        },
        recieverAcc: {
          type: String,
        },
        paidAt: {
          type: Date,
        },
      },
    ],
  },
  { timestamps: true }
);
MarketingLogsSchema.pre(/^find/, function (next) {
  // this => query
  this.populate({ path: "invitor", select: "name email profileImg" });
  this.populate({ path: "marketer", select: "name email profileImg" });
  this.populate({
    path: "transactionsGT500.child",
    select: "name email profileImg telegram",
  });
  this.populate({
    path: "transactionsLT500.child",
    select: "name email profileImg telegram",
  });
  next();
});

const MarketingLog = mongoose.model("MarketingLogs", MarketingLogsSchema);

module.exports = MarketingLog;
