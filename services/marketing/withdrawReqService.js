const WithdrawRequest = require("../../models/marketingModels/WithdrawRequestsModel");
const factory = require("../handllerFactory");

//---------------------------------------------------------------------------------------------------//
// Create a new WithdrawRequest
exports.createWithdrawRequest = factory.createOne(WithdrawRequest);
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