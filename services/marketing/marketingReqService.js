const MarketingRequest = require("../../models/marketingModels/MarketingRequests");
const MarketingLog= require("../../models/marketingModels/MarketingModel");
const factory = require("../handllerFactory");
// const User = require("../../models/userModel");

//---------------------------------------------------------------------------------------------------//
// Create a new MarketingRequests
exports.createMarketingRequest = factory.createOne(MarketingRequest);
//---------------------------------------------------------------------------------//
// Get all MarketingRequests
exports.getAllMarketingRequests = factory.getALl(MarketingRequest);
//---------------------------------------------------------------------------------//
// Get a specific MarketingRequests by ID
exports.getMarketingRequestbyId = factory.getOne(MarketingRequest);
//---------------------------------------------------------------------------------//
// Delete a MarketingRequests  by ID
exports.deleteMarketingRequest = factory.deleteOne(MarketingRequest);
//---------------------------------------------------------------------------------//
// Update a MarketingRequests by ID
exports.acceptMarketingRequest = async (req, res) => {
  const { id } = req.params;
  
  //get user marketLog and update his role 
  const MarketRequest =await MarketingRequest.findOneAndUpdate(
    { _id: id },
    { status: true },
    true
  ); 
  // eslint-disable-next-line no-use-before-define
  await MarketingLog.findOneAndUpdate(
    { marketer: MarketRequest.user },
    { role: "marketer" },
    true
    );
    
    //SEND EMAIL TO   MarketRequest.user Telling him he he been marketer 
      
      


    return true 

};

