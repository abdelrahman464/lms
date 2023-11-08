const User = require("../../models/userModel");
const MarketingLog = require("../../models/marketingModels/MarketingModel");


//when creating invoice check the date if same monthe   update invoice  if not create new one 


//1
//@desc invite friends to signup throught your code
//@access public
exports.inviteOthers = async (req, res) => {
  try {
    const link = `${process.env.BASE_URL}/signup/${req.user._id}`;
   //check if user has marketlog 
    if(!req.user.startMarketing){ 
      await MarketingLog.create({
      marketer: req.user._id,
      invitor: req.user.invitor,
      role:"user"
    });
  }
    return res.status(200).json({ link });
  } catch (error) {
    return res.status(200).json({ error });
  }
};


//@desc calculate the profit for marketers
//@params  userId(mongoId) amount(int)
//prerequests => add to users collection {balance , invitorId}
exports.calculateProfits = async (
   //don't forget to send amount here and email
   req,res
) => {
  try {
    const userEmail = "abdogomaa4@gmail.com";
    const user = await User.findOne({ email: userEmail });
    const amount=100;
    if (!user.invitor) {
      console.log("no invitor");
    }
   
    const invitor = await MarketingLog.findOne({marketer: user.invitor.toString() });
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

      // eslint-disable-next-line no-use-before-define
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
      // eslint-disable-next-line no-use-before-define
      await updateMarketer(invitor,amount,user.email)
    }

  } catch (error) {
    console.log("error from calculateProfits: ", error);
  }
    }

//--------------------------------------------------------------------------------------------------------------------------------------//
const updateMarketer = async (marketer, amountD,childEmail) => {
  const percentage = await calculatePercentage(marketer.mySales+1,marketer.customerSales); // i added 1 cause mySales not updated yet 
  const totalSalesMoney = marketer.totalSalesMoney + amountD;
  const mySales = marketer.mySales + 1;
  const profits = (percentage / 100) * totalSalesMoney;

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
  // await updateInvitorData(marketer,totalSalesMoney);
  await updateInvitorData(marketer,totalSalesMoney);
  
};
//-----------------------------------------------------------------------------------------------------------------------------------//
const updateCustomer = async (customer, amountC, childEmail) => {
  try {
    //1-calculating new values 
    const percentage = 20;
    const totalSalesMoney = customer.totalSalesMoney + amountC;
    const mySales = customer.mySales + 1;

    if (typeof percentage !== 'number' || typeof totalSalesMoney !== 'number' || isNaN(percentage) || isNaN(totalSalesMoney)) {
      throw new Error('Invalid input for calculation');
    }
    const profits = Number((percentage / 100) * totalSalesMoney);

    if (isNaN(profits)) {
      throw new Error('Invalid calculation for profits');
    }
    //2-updating the new values 
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
    //3- check if customer hasn't an invitor 
    if(customer.invitor===null){
      return 
    }
    const invitor = await MarketingLog.findOne({ marketer: customer.invitor.toString() });
    //4-check if his invitor isn't marketer 
    if (invitor && invitor.role === "marketer") {
      const invitorCustomerSales = invitor.customerSales + 1;

      const invitorPercentage  = await calculatePercentage(invitor.mySales, invitorCustomerSales); //i didn't pass invitor.customerSales cause it's not updated
      
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
      console.log("customer updated successfully \n his father also updated successfully")
      if(invitor.invitor===null){
        return 
      }
      await updateInvitorData(invitor,invitor.totalSalesMoney);
    }else{
      return 
    }
  } catch (error) {
    console.error(error);
  }
};

//-----------------------------------------------------------------------------------------------------------------------------------//
//@desc i will send a marketer to it and it will calculate the profits of his fathers :)
const updateInvitorData = async (marketer,amountZ) => {
  try {
    const user = await User.findById(marketer.marketer);
    const childEmail = user.email;
    let percentage = 6 / 100;

   //loop 5 times 
    for (let i = 1; i <= 5; i += 1) {


      marketer = await MarketingLog.findOne({ marketer: marketer.invitor.toString() });
      if (!marketer || marketer.role === "customer") {
        console.log(i,":his invitor is customer ")
        break;
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
              "transactions.$.amount":(percentage * amountZ).toFixed(2),
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
                generation: i ,
              },
            },
          }
        );
      }
      console.log(i,": done")
      //check if he has a father :)
      if(marketer.invitor===null){
        console.log(i,":don't have invitor ")
        break;
      }
      
      percentage = 3.5 / 100;
    }
    return true;
  } catch (error) {
    console.log("error:", error);
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
//-----------------------------------------------------------------------------------------------------------------------//
exports.getMarketLog = async(req,res) => {
  const{marketerId}=req.params
  const marketLog= await MarketingLog.findOne({marketer:marketerId }) //req.user._id
  if(!marketLog){
    return res.status(404).json({status:"faild","msg":"not found"});
  }

  let totalTreeProfits = 0;
  for (const transaction of marketLog.transactions) {
    if (!transaction.calculated) {
      totalTreeProfits += transaction.amount;
      
    }
  }
  const totalProfits = totalTreeProfits + marketLog.profits;

  return res.status(200).json({status:"success",marketLog,totalTreeProfits,totalProfits});

}



//@desc i will use this function when i pay to user
//embeded function 

exports.createInvoice = async(marketerId) => {

  
  const marketLog= await MarketingLog.findOne({marketer:marketerId})
 
  if (!marketLog) {
    console.error('No marketing log found for the user');
    return;
  }
  const currentDate = new Date();
  
  let totalTreeProfits = 0;
  for (const transaction of marketLog.transactions) {
     totalTreeProfits += transaction.amount;
  }

  marketLog.invoices.push({
    totalSalesMoney:marketLog.totalSalesMoney,
    mySales:marketLog.mySales,
    customerSales:marketLog.customerSales,
    percentage:marketLog.percentage,
    direct_profits: marketLog.profits,
    tree_profits: totalTreeProfits,
    desc: `Invoice for ${currentDate.toLocaleString('default', { month: 'long' })}`,
    Date: currentDate,
  });
 
  // Reset the fields
  marketLog.direct_transactions = [];
  marketLog.transactions = [];
  marketLog.totalSalesMoney=0;
  marketLog.profits=0;
  marketLog.percentage=0;
  marketLog.mySale=0;
  marketLog.customerSales=0;
 // Save the changes
  await marketLog.save();

  return true;
};