const mongoose = require("mongoose");

const withdrawRequestsSchema = new mongoose.Schema({
user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
amount: {
    type: String
  },
paymentMethod: { //image uploading 
    type: String,
    Enum:['wise','crypto']
  },
recieverAcc: { //image uploading 
    type: String,
},
status:{
    type:Boolean,
    default:false
  }
  
}, { timestamps: true });

const WithdrawRequests= mongoose.model("withdrawRequests", withdrawRequestsSchema);

module.exports = WithdrawRequests;