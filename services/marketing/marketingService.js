const User = require("../../models/userModel");
const MarketingLog = require("../../models/marketingModels/MarketingModel");

//when creating invoice check the date if same monthe   update invoice  if not create new one

//1
//@desc invite friends to signup throught your code
//@access public
exports.startMarketing = async (req, res) => {
  try {
    if (req.user.startMarketing) {
      return res
        .status(400)
        .json({ status: "faild", msg: `you already started marketing` });
    }
    await MarketingLog.create({
      marketer: req.user._id,
      invitor: req.user.invitor,
      role: "customer",
    });
    await User.findOneAndUpdate({ _id: req.user._id }, { sentRequest: true });
    return res.status(200).json({
      msg: "success",
      message: `you has started marketing successfully`,
    });
  } catch (error) {
    return res.status(400).json({ error });
  }
};
//-------------------------------------------------------------------------------------------------------------------------------------//
const calculatePercentage = async (Sales, category) => {
  try {
    let percentage;
    if (category === "GT500") {
      //first percentage
      if (Sales >= 1 && Sales <= 50) {
        percentage = 25;
      }
      //first increase
      else if (Sales > 50 && Sales <= 70) {
        percentage = 30;
      }
      //second increase
      else if (Sales > 70 && Sales <= 100) {
        percentage = 35;
      }
      //third increase
      else if (Sales > 100) {
        percentage = 45;
      }
      //no increase
      else {
        percentage = 0;
      }
    } else if (category === "LT500") {
      //first percentage
      if (Sales >= 1 && Sales <= 50) {
        percentage = 30;
      }
      //first increase
      else if (Sales > 50 && Sales <= 70) {
        percentage = 35;
      }
      //second increase
      else if (Sales > 70 && Sales <= 100) {
        percentage = 40;
      }
      //third increase
      else if (Sales > 100) {
        percentage = 45;
      }
      //no increase
      else {
        percentage = 0;
      }
    }
    return percentage;
  } catch (error) {
    return error;
  }
};
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
exports.inviteOthers = async (req, res) => {
  try {
    const link = `${process.env.BASE_URL}/signup/${req.user._id}`;
    return res.status(200).json({ link });
  } catch (error) {
    return res.status(200).json({ error });
  }
};
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
exports.calculateProfitsManual = async (
  //don't forget to send amount here and email
  req,
  res
) => {
  try {
    const { userEmail, amount } = req.body; //purchaser :)
    const user = await User.findOne({ email: userEmail });
    if (!user || !amount) {
      return res
        .status(404)
        .json({ status: "faild", msg: "data not complete" });
    }

    if (!user) {
      return res.status(404).json({ status: "faild", msg: "user not found" });
    }

    if (!user.invitor) {
      return res.status(404).json({ status: "faild", msg: "no valid invitor" });
    }

    let response;
    if (amount > 500) {
      // eslint-disable-next-line no-use-before-define
      response = await updateMarketerGT500(user.invitor, amount, user.email);
    } else {
      response = await updateMarketerLT500(user.invitor, amount, user.email);
    }
    console.log(response);
    return res.status(200).json({ msg: response });
  } catch (error) {
    console.log("error from calculateProfits: ", error);
    return res.json({ msg: `error from calculateProfits:  ${error}` });
  }
};
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
//@desc calculate the profit for marketers
//@params  userId(mongoId) amount(int)
//prerequests => add to users collection {balance , invitorId}
exports.calculateProfits = async (
  //don't forget to send amount here and email
  email,
  amount
) => {
  try {
    const user = await User.findOne({ email: email });

    if (!user.invitor) {
      console.log("no valid invitor");
      return;
    }

    let response;

    if (amount > 500) {
      // eslint-disable-next-line no-use-before-define
      response = await updateMarketerGT500(user.invitor, amount, user.email);
    } else {
      response = await updateMarketerLT500(user.invitor, amount, user.email);
      console.log(response);
      return response;
    }

    console.log(response);
    return response;
  } catch (error) {
    console.log("error from calculateProfits: ", error);
  }
};

//--------------------------------------------------------------------------------------------------------------------------------------//
const updateMarketerGT500 = async (marketerId, amountD, childEmail) => {
  console.log("we are in updateMarketerGT500 now");
  const marketerMarketLog = await MarketingLog.findOne({
    marketer: marketerId,
  });
  //check if invitor exist
  if (!marketerMarketLog) {
    return "no valid invitor";
  }

  //calculate profits
  const percentageGT500 = await calculatePercentage(
    // marketerMarketLog.transactionsGT500.length + 1,
    marketerMarketLog.transactionsGT500.length + 1, // don't forget to change it
    "GT500"
  ); // i added 1 cause mySales not updated yet
  const totalSalesMoneyGT500 =
    marketerMarketLog.totalSalesMoneyGT500 + parseFloat(amountD);

  const profitsGT500 = (percentageGT500 / 100) * totalSalesMoneyGT500;

  console.log("step 2");
  await MarketingLog.findOneAndUpdate(
    { marketer: marketerMarketLog.marketer },
    {
      $push: {
        transactionsGT500: {
          childEmail: childEmail,
          amount: amountD,
        },
      },
      $set: {
        totalSalesMoneyGT500: totalSalesMoneyGT500,
        percentageGT500: percentageGT500,
        profitsGT500: profitsGT500,
      },
    }
  );
  console.log("step 3");
  return "updated successfully";
};
//--------------------------------------------------------------------------------------------------------------------------------------//
const updateMarketerLT500 = async (marketerId, amountD, childEmail) => {
  console.log("we are in updateMarketerLT500 now");
  const marketerMarketLog = await MarketingLog.findOne({
    marketer: marketerId,
  });
  //check if invitor exist
  if (!marketerMarketLog) {
    return "no valid invitor";
  }

  //calculate profits
  const percentageLT500 = await calculatePercentage(
    marketerMarketLog.transactionsLT500.length + 1,
    "LT500"
  ); // i added 1 cause mySales not updated yet

  const totalSalesMoneyLT500 =
    marketerMarketLog.totalSalesMoneyLT500 + parseFloat(amountD);
  const profitsLT500 = (percentageLT500 / 100) * totalSalesMoneyLT500;

  console.log("step 2");
  await MarketingLog.findOneAndUpdate(
    { marketer: marketerMarketLog.marketer },
    {
      $push: {
        transactionsLT500: {
          childEmail: childEmail,
          amount: amountD,
        },
      },
      $set: {
        totalSalesMoneyLT500: totalSalesMoneyLT500,
        percentageLT500: percentageLT500,
        profitsLT500: profitsLT500,
      },
    }
  );
  console.log("step 3");
  return "updated successfully";
};

//-----------------------------------------------------------------------------------------------------------------------//
exports.getMarketLog = async (req, res) => {
  const { marketerId } = req.params;
  const marketLog = await MarketingLog.findOne({ marketer: marketerId }); //req.user._id
  if (!marketLog) {
    return res.status(404).json({ status: "faild", msg: "not found" });
  }

  return res.status(200).json({ status: "success", marketLog });
};
//-----------------------------------------------------------------------------------------------------------------------//
exports.getMyMarketLog = async (req, res) => {
  const marketLog = await MarketingLog.findOne({ marketer: req.user._id }); //req.user._id
  if (!marketLog) {
    return res.status(404).json({ status: "faild", msg: "not found" });
  }

  return res.status(200).json({ status: "success", marketLog });
};
//-----------------------------------------------------------------------------------------------------------------------//

//@desc i will use this function when i pay to user
//embeded function

const createInvoice = async (marketLog, forPreviousMonth = false) => {
  // Calculate the date for the invoice
  const currentDate = new Date();
  const invoiceDate = forPreviousMonth
    ? new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    : currentDate;

  //check if user has money to be clculated
  if (marketLog.profitsGT500 <= 0 && marketLog.profitsLT500 <= 0) {
    return;
  }

  marketLog.invoices.push({
    totalSalesMoneyGT500: marketLog.totalSalesMoneyGT500,
    totalSalesMoneyLT500: marketLog.totalSalesMoneyLT500,

    mySalesGT500: marketLog.mySalesGT500,
    mySalesLT500: marketLog.mySalesLT500,

    percentageGT500: marketLog.percentageGT500,
    percentageLT500: marketLog.percentageLT500,

    profitsGT500: marketLog.profitsGT500,
    profitsLT500: marketLog.profitsLT500,

    desc: `Invoice for ${invoiceDate.toLocaleString("default", {
      month: "long",
    })}`,
    Date: invoiceDate,
  });

  // Reset the fields
  marketLog.totalSalesMoneyGT500 = 0;
  marketLog.totalSalesMoneyLT500 = 0;

  marketLog.mySalesGT500 = 0;
  marketLog.mySalesLT500 = 0;

  marketLog.percentageGT500 = 0;
  marketLog.percentageLT500 = 0;

  marketLog.profitsGT500 = 0;
  marketLog.profitsLT500 = 0;

  marketLog.transactionsGT500 = [];
  marketLog.transactionsLT500 = [];

  // Save the changes
  await marketLog.save();

  return true;
};

//test it
exports.createInvoiceForAllUsers = async (req, res) => {
  try {
    // Get all marketers
    const marketLogs = await MarketingLog.find();

    // Iterate through each marketer
    for (const marketLog of marketLogs) {
      // Call the createInvoice function for the user
      await createInvoice(marketLog, true); // Passing true to create invoice for the previous month
    }

    res.status(200).json({
      status: "success",
      msg: "Invoices created successfully for all users.",
    });
  } catch (error) {
    console.error("Error creating invoices:", error);

    res.status(500).json({
      status: "failed",
      msg: `Error creating invoices: ${error}`,
    });
  }
};
//-----------------------------------------------------------------------------------------------//
exports.getMyChildren = async (req, res) => {
  const { marketerId } = req.params;
  console.log(marketerId);
  const children = await User.find({ invitor: marketerId }).select(
    "name email profileImg startMarketing"
  );

  if (children.length === 0) {
    return res.status(404).json({ status: "faild", msg: "no data found" });
  }

  return res.status(200).json({ status: "success", data: children });
};
//-----------------------------------------------------------------------------------------------//
const updateChildrenBrokers = async (marketerId, broker) => {
  // Find all marketLogs with the same invitor
  const marketLogs = await MarketingLog.find({ invitor: marketerId });

  // Update the broker field for each marketLog
  for (const marketLog of marketLogs) {
    marketLog.broker = broker;
    await marketLog.save();
    // Recursively update the children brokers
    await updateChildrenBrokers(marketLog.marketer, broker);
  }
};
//-----------------------------------------------------------------------------------------------//
exports.updateBroker = async (req, res) => {
  try {
    const { marketLogId, broker } = req.body;

    // 1- Get the marketLog with id from params
    const marketLog = await MarketingLog.findById(marketLogId);

    if (!marketLog) {
      return res
        .status(404)
        .json({ status: "failed", msg: "Market log not found" });
    }

    // 2- Update the broker field
    marketLog.broker = broker;

    // 3- Update all marketlogs with the same invitor and their children and their children children and so on
    await updateChildrenBrokers(marketLog.marketer, broker);

    // Save the updated marketLog
    await marketLog.save();

    return res
      .status(200)
      .json({ status: "success", msg: "Broker updated successfully" });
  } catch (error) {
    console.error("Error updating broker:", error);

    return res
      .status(500)
      .json({ status: "failed", msg: `Error updating broker: ${error}` });
  }
};
//-----------------------------------------------------------------------------//
