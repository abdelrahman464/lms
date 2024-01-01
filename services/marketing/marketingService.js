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
    // return res.json(user)
    const invitor = await MarketingLog.findOne({
      marketer: user.invitor,
    });
    //check if invitor exist
    if (!invitor) {
      return res
        .status(404)
        .json({ status: "faild", msg: "invitor not found" });
    }
    // return res.json(invitor)
    let response;
    if (invitor.role === "customer") {
      response = await updateCustomer(invitor, amount, user.email);
    } else {
      response = await updateMarketer(invitor, amount, user.email);
    }
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
    // return res.json(user)
    const invitor = await MarketingLog.findOne({
      marketer: user.invitor,
    });
    //check if invitor exist
    if (!invitor) {
      return;
    }
    // return res.json(invitor)

    if (invitor.role === "customer") {
      //select user from MarketingLog
      //update his total salesMoney
      //increment his mySales
      //update his profits (20% of his total salesMoney)
      //save the transaction in his direct_transactions

      // eslint-disable-next-line no-use-before-define
      const response = await updateCustomer(invitor, amount, user.email);
      console.log(response);
      return res.json({ msg: response });

      //check his father if he is marketer
      //if yes:
      //save transaction to his father in transactions
      //increment customerSales by 1
      //update his percentage of marketer
      //update his profits of marketer
    } else {
      //select user from MarketingLog
      //update his total salesMoney
      //increment his mySales
      //save transaction in direct_transactions
      //update his percentage
      //calculate profits of him and save it , let's call it profitZ

      //check his father
      //if he is marketer give him 6% of profitZ
      //if not , finish the function
      //then get this father and
      //loop till his forth father
      //in each loop do that
      //check his father , if not marketer finish the function
      //Give His Father a 3.5% of profitZ
      // eslint-disable-next-line no-use-before-define
      const response = await updateMarketer(invitor, amount, user.email);
      console.log(response);
      return res.json({ msg: response });
    }
  } catch (error) {
    console.log("error from calculateProfits: ", error);
  }
};

//--------------------------------------------------------------------------------------------------------------------------------------//
const updateMarketer = async (marketer, amountD, childEmail) => {
  console.log("we are in updateMarketer now");
  const percentage = await calculatePercentage(
    marketer.mySales + 1,
    marketer.customerSales
  ); // i added 1 cause mySales not updated yet
  const totalSalesMoney = marketer.totalSalesMoney + parseFloat(amountD);
  const mySales = marketer.mySales + 1;
  const profits = (percentage / 100) * totalSalesMoney;

  console.log("step 2");
  await MarketingLog.findOneAndUpdate(
    { marketer: marketer.marketer },
    {
      $push: {
        direct_transactions: {
          childEmail: childEmail,
          amount: amountD,
        },
      },
      $set: {
        totalSalesMoney: totalSalesMoney,
        mySales: mySales,
        percentage: percentage,
        profits: profits,
      },
    }
  );
  console.log("step 3");
  // await updateInvitorData(marketer,totalSalesMoney);
  return await updateInvitorData(
    marketer,
    totalSalesMoney + marketer.customerSalesMoney
  );
};
//-----------------------------------------------------------------------------------------------------------------------------------//
const updateCustomer = async (customer, amountC, childEmail) => {
  try {
    console.log("we are in updateCustomers");
    //1-calculating new values
    const percentage = 20;
    const totalSalesMoney = customer.totalSalesMoney + parseFloat(amountC);
    const mySales = customer.mySales + 1;
    const profits = Number((percentage / 100) * totalSalesMoney);

    //2- update the customer  (seller)
    await MarketingLog.findOneAndUpdate(
      { marketer: customer.marketer },
      {
        $push: {
          direct_transactions: {
            childEmail: childEmail,
            amount: amountC,
          },
        },
        $set: {
          totalSalesMoney: totalSalesMoney,
          mySales: mySales,
          percentage: percentage,
          profits: profits,
        },
      }
    );
    // !!!!!------------------ START UPDATE HIS FATHER  --------------!!!!!
    //3- Check If Customer Had an Invitor
    if (customer.invitor === null) {
      return "customer updated successfully \n but he doesn't have an invitor";
    }
    let currentCustomer = customer;
    let invitor;
    let generation = 0;
    //---------
    do {
      // eslint-disable-next-line no-await-in-loop
      invitor = await MarketingLog.findOne({
        marketer: currentCustomer.invitor,
      });
      // If invitor is not found, return false
      if (!invitor) {
        return "customer updated successfully \n but he doesn't have an invitor with Role Marketer";
      }
      currentCustomer = invitor;
      generation++;
      // Continue looping until invitor is found and invitor.role is "marketer"
    } while (invitor && invitor.role !== "marketer");
    //-----

    // Continue
    const invitorCustomerSales = invitor.customerSales + 1;
    const finalCustomerSalesMoney = invitor.customerSalesMoney + amountC;

    //5- Calculate Invitor Percentage
    const invitorPercentage = await calculatePercentage(
      invitor.mySales,
      invitorCustomerSales
    ); //i didn't pass invitor.customerSales cause it's not updated

    const invitorProfits = (invitorPercentage / 100) * totalSalesMoney;

    //6- This Is The Diff Between Invitor and Customer Percentage
    const invitorCustomerPercentage = invitorPercentage - 20;

    //7- This Is The Profits That Invitor will Gain
    const invitorCustomerProfit = (
      (invitorCustomerPercentage / 100) *
      totalSalesMoney
    ).toFixed(2);
    console.log("invitorCustomerProfit=> " + invitorCustomerProfit);

    const existingTransaction = await MarketingLog.findOne({
      marketer: invitor.marketer,
      "cutomerProfitsTransactions.customer": customer.marketer,
    });

    if (existingTransaction) {
      console.log("exist +" + invitorCustomerProfit);
      await MarketingLog.findOneAndUpdate(
        {
          marketer: invitor.marketer,
          "cutomerProfitsTransactions.customer": customer.marketer,
        },
        {
          $set: {
            customerSales: invitorCustomerSales,
            customerSalesMoney: finalCustomerSalesMoney, //update total customerSalesMoney
            percentage: invitorPercentage,
            profits: invitorProfits,

            "cutomerProfitsTransactions.$.amount": invitorCustomerProfit,
            "cutomerProfitsTransactions.$.percentage":
              invitorCustomerPercentage,
          },
        }
      );
    } else {
      await MarketingLog.findOneAndUpdate(
        { marketer: invitor.marketer },
        {
          $set: {
            customerSales: invitorCustomerSales,
            customerSalesMoney: finalCustomerSalesMoney, //update total customerSalesMoney
            percentage: invitorPercentage,
            profits: invitorProfits,
          },
          $push: {
            cutomerProfitsTransactions: {
              customer: customer.marketer,
              amount: invitorCustomerProfit,
              generation: generation,
              percentage: invitorCustomerPercentage,
            },
          },
        }
      );
    }
    console.log(
      "customer updated successfully \n his father also updated successfully"
    );
    if (invitor.invitor === null) {
      return "customer updated successfully \n his father also updated successfully \n but his father doesn't have an invitor";
    }
    return await updateInvitorData(
      invitor,
      invitor.totalSalesMoney + finalCustomerSalesMoney
    );
  } catch (error) {
    console.error(error);
    return false;
  }
};

//-----------------------------------------------------------------------------------------------------------------------------------//
//@desc i will send a marketer to it and it will calculate the profits of his fathers :)
const updateInvitorData = async (marketer, amountZ) => {
  try {
    console.log("WE ARE in update invitors now ");
    const user = await User.findById(marketer.marketer); // htis step to get his email only
    const childEmail = user.email;
    let percentage = 6 / 100;

    //loop 5 times
    console.log("START ITERATION ------------------------");
    for (let i = 1; i <= 5; i += 1) {
      console.log("START ITERATION " + i);
      marketer = await MarketingLog.findOne({
        marketer: marketer.invitor,
      });
      console.log("marketer number " + i);
      if (!marketer || marketer.role === "customer") {
        console.log(i, ":his invitor is customer ");
        return `customer updated successfully \n his father also updated successfully \n but his fathers were updated successfully till father num ${
          i - 1
        } \n father num ${i} his invitor is customer`;
      }

      let existingTransaction = await MarketingLog.findOne({
        marketer: marketer.marketer,
        "transactions.childEmail": childEmail,
      });

      if (existingTransaction) {
        await MarketingLog.findOneAndUpdate(
          {
            marketer: marketer.marketer,
            "transactions.childEmail": childEmail,
          },
          {
            $set: {
              "transactions.$.amount": (percentage * amountZ).toFixed(2),
            },
          }
        );
      } else {
        await MarketingLog.findOneAndUpdate(
          { marketer: marketer.marketer },
          {
            $push: {
              transactions: {
                childEmail: childEmail,
                amount: (percentage * amountZ).toFixed(2),
                generation: i,
              },
            },
          }
        );
      }
      console.log(i, ": done");
      //check if he has a father :)
      if (marketer.invitor === null) {
        console.log(i, ":don't have invitor ");
        return `customer updated successfully \n his father also updated successfully \n and his fathers were updated successfully till father num ${i} doesn't have an invitor`;
      }

      percentage = 3.5 / 100;
    }

    return `customer updated successfully \n his father also updated successfully \n and all his fathers were updated successfully till father num 5`;
  } catch (error) {
    console.log("error:", error);
    return false; // Return false or an error message
  }
};

//-------------------------------------------------------------------------------------------------------------------------------------//
const calculatePercentage = async (mySales, customerSales) => {
  try {
    const totalSales = mySales + customerSales;
    let percentage;
    if (totalSales >= 1 && totalSales <= 15) {
      percentage = 35;
    } else if (totalSales >= 16 && totalSales <= 30) {
      percentage = 45;
    } else if (totalSales >= 31 && totalSales <= 50) {
      percentage = 50;
    } else if (totalSales >= 51) {
      percentage = 60;
    } else {
      percentage = 0;
    }

    return percentage;
  } catch (error) {
    return error;
  }
};
//-----------------------------------------------------------------------------------------------------------------------//
exports.getMarketLog = async (req, res) => {
  const { marketerId } = req.params;
  const marketLog = await MarketingLog.findOne({ marketer: marketerId }); //req.user._id
  if (!marketLog) {
    return res.status(404).json({ status: "faild", msg: "not found" });
  }

  let totalTreeProfits = 0;
  for (const transaction of marketLog.transactions) {
    if (!transaction.calculated) {
      totalTreeProfits += transaction.amount;
    }
  }
  const totalProfits = totalTreeProfits + marketLog.profits;

  return res
    .status(200)
    .json({ status: "success", marketLog, totalTreeProfits, totalProfits });
};
//-----------------------------------------------------------------------------------------------------------------------//
exports.getMyMarketLog = async (req, res) => {
  const marketLog = await MarketingLog.findOne({ marketer: req.user._id }); //req.user._id
  if (!marketLog) {
    return res.status(404).json({ status: "faild", msg: "not found" });
  }
  let totalTreeProfits = 0;
  for (const transaction of marketLog.transactions) {
    if (!transaction.calculated) {
      totalTreeProfits += transaction.amount;
    }
  }
  const totalProfits = totalTreeProfits + marketLog.profits;
  return res
    .status(200)
    .json({ status: "success", marketLog, totalTreeProfits, totalProfits });
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

  let totalTreeProfits = 0;
  let totalCustomersProfits = 0;
  for (const transaction of marketLog.transactions) {
    totalTreeProfits += transaction.amount;
  }
  for (const customerTransaction of marketLog.cutomerProfitsTransactions) {
    totalCustomersProfits += customerTransaction.amount;
  }
  //check if user has money to be clculated
  if (
    totalTreeProfits <= 0 &&
    marketLog.totalSalesMoney <= 0 &&
    totalCustomersProfits <= 0
  ) {
    return;
  }

  marketLog.invoices.push({
    totalSalesMoney: marketLog.totalSalesMoney,
    mySales: marketLog.mySales,
    customerSales: marketLog.customerSales,
    percentage: marketLog.percentage,
    direct_profits: marketLog.profits,
    tree_profits: totalTreeProfits,
    customers_profits: totalCustomersProfits,
    desc: `Invoice for ${invoiceDate.toLocaleString("default", {
      month: "long",
    })}`,
    Date: invoiceDate,
  });

  // Reset the fields
  marketLog.totalSalesMoney = 0;
  marketLog.mySales = 0;
  marketLog.customerSales = 0;
  marketLog.percentage = 0;
  marketLog.profits = 0;
  marketLog.customerSalesMoney = 0;
  marketLog.direct_transactions = [];
  marketLog.transactions = [];
  marketLog.cutomerProfitsTransactions = [];
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
//--------------
exports.recalculateProfits = async (req, res) => {
  try {
    // Fetch all MarketingLogs
    const marketingLogs = await MarketingLog.find();
    // Iterate through each log
    for (const log of marketingLogs) {
      // Check if direct_transactions is empty
      if (log.direct_transactions.length === 0) {
        continue; // Skip to the next log
      }

      // Calculate total sales money from direct_transactions
      const totalSalesMoney = log.direct_transactions.reduce(
        (total, transaction) => total + transaction.amount,
        0
      );

      // Update totalSalesMoney
      log.totalSalesMoney = totalSalesMoney;

      // Recalculate profits based on percentage
      log.profits = (log.percentage / 100) * totalSalesMoney;

      // Save the updated log
      await log.save();
    }

    console.log("Profits recalculated successfully.");
    return res.status(200).json({ msg: "Profits recalculated successfully." });
  } catch (error) {
    console.error("Error recalculating profits:", error.message);
    return res.status(200).json({ msg: error.message });
  }
};
