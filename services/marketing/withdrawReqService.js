const WithdrawRequest = require("../../models/marketingModels/WithdrawRequestsModel");
const MarketingLog = require("../../models/marketingModels/MarketingModel");
const{createInvoice}=require("./marketingService")
const factory = require("../handllerFactory");


exports.canSendWithdrawRequest=async(req,res,next)=>{

  const withdrawRequest = await WithdrawRequest.findOne({marketer:req.user._id});
  // return res.json(withdrawRequest)
  if(!withdrawRequest){
    next()
  }
  else if(withdrawRequest.status==="pending"){
    return res.status(400).json({status:"faild",msg:"your request is pending , wait till admin review your request "});
  }
  else if(withdrawRequest.status==="rejectd"){
    return res.status(400).json({status:"faild",msg:"your request was rejected "})
  }
  else if(withdrawRequest.status==="paid"){
    return res.status(400).json({status:"faild",msg:"your request was accepted and you was paid successfully"});
  }
next()

}








//---------------------------------------------------------------------------------------------------//
// Create a new WithdrawRequest
exports.createWithdrawRequest = async (req, res) => {
  const marketingLog = await MarketingLog.findOne({ marketer: req.user._id });
  if (!marketingLog) {
    return res
      .status(200)
      .json({ status: `faild`, msg: "you don't work as marketer" });
  }
  // //calculate his profits
  // let totalTreeProfits = 0;
  // for (const transaction of marketingLog.transactions) {
  //   if (!transaction.calculated) {
  //     totalTreeProfits += transaction.amount;
  //   }
  // }
  const totalProfits =await calculateTotalProfits(marketingLog);
  //check if he has balance
  if (totalProfits < 0) {
    return res
      .status(200)
      .json({ status: `faild`, msg: "your balance not enough" });
  }

  //create the request 
  req.body.marketer = req.user._id;
  const withdrawRequest = await WithdrawRequest.create(req.body);

  return res.status(200).json({ status: `success`, date: withdrawRequest });
};
//---------------------------------------------------------------------------------//
// Get all WithdrawRequest
exports.getAllWithdrawRequests = factory.getALl(WithdrawRequest);
//---------------------------------------------------------------------------------//
// Get a specific WithdrawRequest by ID
exports.getWithdrawRequestbyId = factory.getOne(WithdrawRequest);
//---------------------------------------------------------------------------------//
// Delete a WithdrawRequest  by ID
exports.deleteWithdrawRequest = factory.deleteOne(WithdrawRequest);
//---------------------------------------------------------------------------------//
//@use : inside create invoice function
exports.approveWithdrawRequest = async (userId) => {
  await WithdrawRequest.findOneAndUpdate(
    { user: userId },
    { status: true },
    true
  );
  //SEND EMAIL TO   MarketRequest.user Telling him he he been marketer

  return true;
};
//--------------------------------------------------------------------------------------------

exports.payToMarketer=async(req,res)=>{
  const{id}=req.params;
  //1-selecting the marketer 
  const withdrawRequest= await WithdrawRequest.findOne({_id:id});

  //3-payment process 

  //4-creare an invoice 
  await createInvoice(withdrawRequest.marketer);
  withdrawRequest.status="paid";
  await withdrawRequest.save()


  return res.status(200).json({msg:"successfull payment :)"})
}

//----------------------------                                           -----------------------------

const calculateTotalProfits=async(marketLog)=>{
  let totalTreeProfits = 0;
  for (const transaction of marketLog.transactions) {
    if (!transaction.calculated) {
      totalTreeProfits += transaction.amount;
      
    }
  }
  const totalProfits = totalTreeProfits + marketLog.profits;

  return totalProfits;
}