const User = require("../../models/userModel");
const MarketingLog = require("../../models/marketingModels/MarketingModel");
//1
//@desc invite friends to signup throught your code
//@access public
exports.inviteOthers = async (req, res) => {
  try {
    const link = `${process.env.BASE_URL}/signup/${req.user._id}`;
    await MarketingLog.create({
      marketer: req.user._id,
    });
    return res.status(200).json({ link });
  } catch (error) {
    return res.status(200).json({ error });
  }
};
//2
//@desc change user role to marketer so his percentage will change form 25% to 35%
//@access public
exports.becomeMarketer = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(403).json({ status: "faild", msg: "User Not Found" });
    }

    // Update the user's role to "marketer"
    user.role = "marketer";

    // Save the updated user
    await user.save();

    return res
      .status(200)
      .json({ status: "success", msg: "User role updated to marketer" });
  } catch (error) {
    return res
      .status(400)
      .json({ status: "faild", msg: `Error updating user role:${error}` });
  }
};

//@desc add Transaction And Update marketer's Balance
async function saveTransaction(marketerId, transaction) {
  try {
    // Find the marketing log document associated with the marketerId
    const marketingLog = await MarketingLog.findOne({ marketer: marketerId });

    if (!marketingLog) {
      console.log(
        "Marketing log not found for the specified marketer.",
        marketerId
      );
      return 0;
    }
    // Validate and parse the transaction amount to ensure it's a valid number
    const parsedAmount = parseFloat(transaction.amount);
    console.log(transaction.amount, parsedAmount);
    if (isNaN(parsedAmount)) {
      console.error("Invalid transaction amount:", transaction.amount);
      return 0;
    }
    // Add the transaction to the transactions array in the marketing log document
    marketingLog.transactions.push(transaction);

    // Update the marketer's balance by adding the transaction amount
    marketingLog.balance += parsedAmount;
    marketingLog.balance.toFixed(3)
    // Save the updated marketing log document
    await marketingLog.save();

    console.log("Transaction added and balance updated successfully.");
    return 1;
  } catch (error) {
    console.log("error from saveTransaction: ", error);
    // console.error("Error adding transaction and updating balance:", error);
  }
}
//-------------------------------------------------------------------------------------------//

//@desc calculate the profit for marketers
//@params  userId(mongoId) amount(int)
//prerequests => add to users collection {balance , invitorId}
exports.calculateProfits = async (
  userEmail = "abdogomaa3@gmail.com",
  amount = 100
) => {
  try {
    let user = await User.findOne({ email: "abdogomaa6@gmail.com" });

    if (!user.invitor) {
      console.log("no invitor");
    }
    console.log("first one");
    let invitor = await User.findOne({ _id: user.invitor.toString() });
    //check if invitor exist
    if (!invitor) {
      return;
    }
    let profit;

    if (invitor.role === "user") {
      profit = (25 / 100) * 100;
    } else {
      profit = (35 / 100) * 100;
    }
    const purchaserEmail = user.email;
    for (let i = 1, g = 1; i <= 4; i += 1, g += 1) {
      //save invitor transcation
      const transaction = {
        childEmail: purchaserEmail,
        amount: profit,
        generation: g,
      };
      console.log(`operation ${i}`);
      // eslint-disable-next-line no-await-in-loop
      await saveTransaction(invitor._id.toString(), transaction);
      console.log(`operation ${i} finished`);
      //TODO
      //save transaction to marketLogs with mmarketerId
      if (!invitor.invitor) {
        console.log("tree has ended ");
        break;
      }
      user = invitor;
      invitor = "";
      // eslint-disable-next-line no-await-in-loop
      invitor = await User.findById(user.invitor.toString());

      //TODO
      profit = ((profit * 10) / 100).toFixed(2);
    }
  } catch (error) {
    console.log("error from calculateProfits: ", error);
  }
};

//-------------------------------------------------------------------------------------------//
exports.totalAmountPaid = async (req, res) => {
  try {
    // Find the marketing log document associated with the marketerId
    const marketingLog = await MarketingLog.findOne({
      marketer: req.user._id,
      "transactions.paid": true,
    });

    if (!marketingLog) {
      console.log("Marketing log not found for the specified marketer.");
      return 0; // Return 0 if no marketing log is found
    }

    // Calculate the total amount by summing up the amounts in the transactions array
    const totalAmountPaid = marketingLog.transactions.reduce(
      (total, transaction) => total + transaction.amount,
      0
    );

    return res
      .status(200)
      .json({ msg: `Total amount paid to marketer: ${totalAmountPaid}` });
  } catch (error) {
    return res.status(200).json({ msg: `error: ${error}` });
  }
};
exports.totalAmountUnPaid = async (req, res) => {
  try {
    // Find the marketing log document associated with the marketerId
    const marketingLog = await MarketingLog.findOne({
      marketer: req.user._id,
      "transactions.paid": false,
    });

    if (!marketingLog) {
      console.log("Marketing log not found for the specified marketer.");
      return 0; // Return 0 if no marketing log is found
    }

    // Calculate the total amount by summing up the amounts in the transactions array
    const totalAmountPaid = marketingLog.transactions.reduce(
      (total, transaction) => total + transaction.amount,
      0
    );

    return res
      .status(200)
      .json({ msg: `Total amount unPaid to marketer: ${totalAmountPaid}` });
  } catch (error) {
    return res.status(200).json({ msg: `error: ${error}` });
  }
};
