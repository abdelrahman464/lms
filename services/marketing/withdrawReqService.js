const WithdrawRequest = require("../../models/marketingModels/WithdrawRequestsModel");
const MarketingLog = require("../../models/marketingModels/MarketingModel");
const { createInvoice } = require("./marketingService");
const factory = require("../handllerFactory");

//---------------------------------------------------------------------------------------------------//
// Create a new WithdrawRequest
//@params "month" of the invoice
exports.requestInvoice = async (req, res) => {
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
  try {
    const status = req.params.status ? req.params.status : "pending";
    console.log(status);

    const requestedInvoices = await MarketingLog.find({
      "invoices.status": status,
    });

    if (requestedInvoices.length === 0) {
      return res
        .status(404)
        .json({ status: "failed", msg: "No invoices to be paid" });
    } else {
      // Filter only the invoices with the specified status
      const pendingInvoices = requestedInvoices.map((log) => {
        return {
          _id: log._id,
          role: log.role,
          invitor: log.invitor,
          marketer: log.marketer,
          percentage: log.percentage,
          totalSalesMoney: log.totalSalesMoney,
          profits: log.profits,
          mySales: log.mySales,
          customerSales: log.customerSales,
          transactions: log.transactions,
          direct_transactions: log.direct_transactions,
          invoices: log.invoices.filter((invoice) => invoice.status === status),
          createdAt: log.createdAt,
          updatedAt: log.updatedAt,
          __v: log.__v,
        };
      });
      return res
        .status(200)
        .json({
          status: "success",
          length: pendingInvoices.length,
          data: pendingInvoices,
        });
    }
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(500)
      .json({ status: "error", error: "Internal Server Error" });
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
  const { invoiceId } = req.params;
  //1- selecting the marketer
  const marketLog = await MarketingLog.findOne({ "invoice._id": invoiceId });

  // 4- Update the invoices in marketLog
  marketLog.invoices.forEach((invoice) => {
    if (invoice._id.toString() === invoiceId) {
      console.log(invoice)
      invoice.paidAt = new Date();
      invoice.status="paid"
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
