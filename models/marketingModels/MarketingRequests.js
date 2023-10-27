const mongoose = require("mongoose");

const MarketingRequestsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  status:{
    type:Boolean,
    default:false
  }
  
}, { timestamps: true });

const MarketingRequests= mongoose.model("MarketingRequests", MarketingRequestsSchema);

module.exports = MarketingRequests;