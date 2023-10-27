const User = require("../../models/userModel");
const MarketingLog = require("../../models/marketingModels/MarketingModel");
const MarketingRequests = require("../../models/marketingModels/MarketingRequests");

//when creating invoice check the date if same monthe   update invoice  if not create new one 


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
    marketingLog.balance.toFixed(3);
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
    let user = await User.findOne({ email: userEmail });

    if (!user.invitor) {
      console.log("no invitor");
    }
   
    let invitor = await MarketingLog.findOne({marketer: user.invitor.toString() });
    //check if invitor exist
    if (!invitor) {
      return;
    }
   

    if (invitor.role === "customer") {
      //select user from MarketingLog
      //update his total salesMoney
      //increment his mySales
      //update his profits (20% of his total salesMoney) 
      //save the transaction in his direct_transactions
      await updateCustomer(invitor,amount,user.email)
    
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
      await updateMarketer(invitor,amount,user.email)
    }

    }
  } catch (error) {
    console.log("error from calculateProfits: ", error);
  }
};

//-------------------------------------------------------------------------------------------------------------------------------------//
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


//--------------------------------------------------------------------------------------------------------------------------------------//
const updateMarketer = async (marketer, amountD,childEmail) => {
  const calcPercentage = await calculatePercentage(marketer.mySales+1,marketer.customerSales); // i added 1 cause mySales not updated yet
  const percentage = calcPercentage(); 
  const totalSalesMoney = marketer.totalSalesMoney + amountD;
  const mySales = marketer.mySales + 1;
  const profits = (percentage / 100) * totalSalesMoney;

  await MarketingLog.findOneAndUpdate(
    { marketer: marketer._id },
    {
      $push: {
        direct_transactions: {
          childEmail: childEmail,
          amount: amountD,
          Paid: false,
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
  await updateInvitorData(marketer,totalSalesMoney);
  
};
//-----------------------------------------------------------------------------------------------------------------------------------//
const updateCustomer = async (customer, amountC, childEmail) => {
  const percentage = 20;
  const totalSalesMoney = customer.totalSalesMoney + amountC;
  const mySales = customer.mySales + 1;
  const profits = (percentage / 100) * totalSalesMoney;

  await MarketingLog.findOneAndUpdate(
    { marketer: customer.marketer },
    {
      $push: {
        direct_transactions: {
          childEmail: childEmail,
          amount: amountC,
          Paid: false,
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

  let invitor = await MarketingLog.findOne({ marketer: customer.invitor.toString() });
  if (invitor && invitor.role === "marketer") {
    const invitorCustomerSales = invitor.customerSales + 1;

    const invitorPercentage = calculatePercentage(invitor.mySales,invitorCustomerSales); //i didn't pass invitor.customerSales cause it's not updated
    const invitorProfits = (invitorPercentage / 100) * invitor.totalSalesMoney;

    await MarketingLog.findOneAndUpdate(
      { marketer: invitor.marketer },
      {
        $set: {
          customerSales: invitorCustomerSales,
          percentage: invitorPercentage,
          profits: invitorProfits,
        },
      }
    );
    await updateInvitorData(invitor,invitor.totalSalesMoney);
  }
};
//-----------------------------------------------------------------------------------------------------------------------------------//
//@desc i will send a marketer to it and it will calculate the profits of his fathers :)
const updateInvitorData = async (marketer, amountZ) => {
  const user=await User.findById(marketer.marketer);
  const childEmail=user.email;
  
  let invitor = marketer.invitor;
  for (let i = 0; i < 4; i++) {
    let percentage = i === 0 ? 6 / 100 : 3.5 / 100;
    let existingTransaction = await MarketingLog.findOne({
      marketer: invitor.marketer,
      "transactions.childEmail": childEmail,
    });

    if (existingTransaction) {
      await MarketingLog.findOneAndUpdate(
        {
          marketer: invitor.marketer,
          "transactions.childEmail": childEmail,
        },
        {
          $set: {
            "transactions.$.amount": percentage * amountZ,
          },
        }
      );
    } else {
      await MarketingLog.findOneAndUpdate(
        { marketer: invitor.marketer },
        {
          $push: {
            transactions: {
              childEmail: childEmail,
              amount: percentage * amountZ,
              calculated: false,
              generation: i + 1,
            },
          },
        }
      );
    }
    invitor = await MarketingLog.findOne({ marketer: invitor.invitor.toString() });
    if (!invitor || invitor.role === "user") {
      break;
    }
  }
};
//-------------------------------------------------------------------------------------------------------------------------------------//
const calculatePercentage = async (mySales,customerSales) => {
  try {
    const totalSales=mySales+customerSales
    let percentage;
    if(totalSales>=1 && totalSales<=15 ){
      percentage=35
    }
    else if(totalSales>=16 && totalSales<=30 ){
      percentage=45
    }
    else if(totalSales>=31 && totalSales<=50 ){
      percentage=50
    }
    else if(totalSales>=51){
      percentage=60
    }
    else{
      percentage=0
    }

    return percentage
    
  } catch (error) {
    return error;
  }
};
