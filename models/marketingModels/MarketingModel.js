const mongoose = require("mongoose");

//when return his unDirect transaction
//loop on this array and return his total profits
//calculate his total
const MarketingLogsSchema = new mongoose.Schema(
  {
    hasSentRequest: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["customer", "marketer"],
    },
    invitor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    marketer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    totalSalesMoney: {
      //total sales' money i have sold
      type: Number,
      default: 0,
    },
    mySales: {
      //number of directSales i have made
      type: Number,
      default: 0,
    },
    customerSales: {
      //sales i earn from customer under me (not marketer)
      type: Number,
      default: 0,
    },
    percentage: {
      //mySales + customerSales => percentage
      type: Number,
      default: 0,
    },
    profits: {
      //this is profits i gained from mySales based on my percentage
      type: Number,
      default: 0,
    },
    customerSalesMoney: {
      //this is total sales money from my customers
      //@use  i will use in updateInvitors , their percentage will be calculated from   totalSalesMoney+customerSalesMoney
      type: Number,
      default: 0,
    },
    //profits i will gain from my customers   diff(my percentage  - 20 ) * child.totalSalesMoney
    cutomerProfitsTransactions: [
      {
        customer: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        amount: Number,
        percentage: Number,
        generation: Number,
        Date: {
          type: Date,
          default: Date.now(),
        },
      },
    ],
    transactions: [
      {
        childEmail: String,
        amount: Number,
        generation: {
          type: Number,
          Enum: [1, 2, 3, 4, 5],
        },
        Date: {
          type: Date,
          default: Date.now(),
        },
      },
    ],
    //direct sales --> level 1 , under me
    direct_transactions: [
      {
        childEmail: String,
        amount: Number,
        Date: {
          type: Date,
          default: Date.now(),
        },
      },
    ],
    //when we pay to marketer we save invoice here
    invoices: [
      {
        totalSalesMoney: Number,
        mySales: Number,
        customerSales: Number,
        percentage: Number,
        direct_profits: Number,
        tree_profits: Number,
        customers_profits: Number,
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
    path: "cutomerProfitsTransactions.customer",
    select: "name email profileImg",
  });
  next();
});

const MarketingLog = mongoose.model("MarketingLogs", MarketingLogsSchema);

module.exports = MarketingLog;
