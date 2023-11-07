const MarketingLog = require("../../models/marketingModels/MarketingModel");
const{createInvoice}=require("./marketingService")

exports.payToMarketer=async(req,res)=>{
    const{id}=req.params;
    //1-selecting the marketer 
    const marketLog= await MarketingLog.findOne({marketer:id})

    //2-calculate total profits
    const totalProfits=await calculateTotalProfits(marketLog);
    //3-payment process 

    //4-creare an invoice 
    await createInvoice(marketLog);

    return res.status(200).json({msg:"successfull payment :)"})
}


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