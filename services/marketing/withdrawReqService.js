const WithdrawRequest = require("../../models/marketingModels/WithdrawRequestsModel");
const MarketingLog = require("../../models/marketingModels/MarketingModel");
const { createInvoice } = require("./marketingService");
const factory = require("../handllerFactory");

//---------------------------------------------------------------------------------------------------//
// Create a new WithdrawRequest
//@params "month" of the invoice
exports.createWithdrawRequest = async (req, res) => {
  const marketingLog = await MarketingLog.findOne({
    marketer: req.user._id,
    "invoices._id": req.body.invoiceId,
  });
  // return res.json(marketingLog)
  if (!marketingLog) {
    return res
      .status(200)
      .json({ status: `faild`, msg: "you don't work as marketer" });
  }
  // 4- Update the invoices in marketLog
  marketingLog.invoices.forEach((invoice) => {
    if (invoice._id.toString() === req.body.invoiceId) {
      console.log(invoice);
      //check if he requests this invoice before
      if (invoice.status === "pending") {
        return res.status(400).json({
          status: `success`,
          msg: "you have requests this invoice to be paid before ",
        });
      }
      // else , update his fields
      invoice.status = "pending";
      invoice.recieverAcc = req.body.recieverAcc;
      invoice.paymentMethod = req.body.paymentMethod;
    }
  });
  await marketingLog.save();

  return res.status(200).json({
    status: `success`,
    msg: "you have requests this invoice to be paid successfully ",
  });
};
//---------------------------------------------------------------------------------//
// Get all WithdrawRequest
exports.getAllRequestedInvoices = async (req, res) => {
  const { status } = req.params;
  console.log(status);
  const requestedInvoices = await MarketingLog.find({
    "invoices.status": "unpaid",
  });
  if (requestedInvoices.length == 0) {
    return res
      .status(404)
      .json({ status: "faild", msg: "no invoices to be paid" });
  } else {
    return res.status(200).json({ status: "success", data: requestedInvoices });
  }
};
//---------------------------------------------------------------------------------//
// Get a specific WithdrawRequest by ID
exports.getWithdrawRequestbyId = async (req, res) => {
  const requestedInvoices = await MarketingLog.findOne({
    "invoices._id": req.body.invoiceId,
  });
  if (!requestedInvoices) {
    return res.status(404).json({ status: "faild", msg: "no invoice found" });
  } else {
    return res.status(200).json({ status: "success", data: requestedInvoices });
  }
};
//--------------------------------------------------------------------------------------------
//@params 'month' of invoice  {body}
//@params id of user of invoice  {params}
exports.payToMarketer = async (req, res) => {
  const { id } = req.params;
  //1- selecting the marketer
  const withdrawRequest = await WithdrawRequest.findOne({ _id: id });
  //2- select his marketerLog
  const marketLog = await MarketingLog.findOne({
    marketer: withdrawRequest.marketer,
    "invoices.month": withdrawRequest.month,
    "invoices.paidAt": null,
  });

  //3-
  // 4- Update the invoices in marketLog
  marketLog.invoices.forEach((invoice) => {
    if (invoice.month === withdrawRequest.month) {
      invoice.paidAt = new Date();
    }
  });

  await marketLog.save();
  //when back
  // test the payToMarketer
  //continue
  //check on senario of payment
  //yousef

  //3-payment process

  //4-creare an invoice

  withdrawRequest.status = "paid";
  await withdrawRequest.save();

  return res.status(200).json({ msg: "successfull payment :)" });
};

//----------------------------                                           -----------------------------

// const calculateTotalProfits=async(marketLog)=>{
//   let totalTreeProfits = 0;
//   for (const transaction of marketLog.transactions) {
//     if (!transaction.calculated) {
//       totalTreeProfits += transaction.amount;

//     }
//   }
//   const totalProfits = totalTreeProfits + marketLog.profits;

//   return totalProfits;
// }
