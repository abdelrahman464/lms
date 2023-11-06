const mongoose = require("mongoose");

const MarketingRequestsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  
  fullName: {
    type: String
  },
  country: {
    type: String
  },
  city: {
    type: String
  },
  birthDate: {
    type: Date
  },
  currentWork: {
    type: String
  },
  ansOfQuestion: {
    type: String
  },
  facebook: {
    type: String
  },
  instgram: {
    type: String
  },
  tiktok: {
    type: String
  },
  telegram: {
    type: String
  },
  identity: { //image uploading 
    type: String
  },
  paymentMethod: { //image uploading 
    type: String,
    Enum:['wise','crypto']
  },
  status:{
    type:Boolean,
    default:false
  }
  
}, { timestamps: true });

const MarketingRequests= mongoose.model("MarketingRequests", MarketingRequestsSchema);

module.exports = MarketingRequests;