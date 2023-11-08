const mongoose = require("mongoose");

const withdrawRequestsSchema = new mongoose.Schema({
marketer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
paymentMethod: { //image uploading 
    type: String,
    Enum:['wise','crypto']
  },
recieverAcc: { //image uploading 
    type: String,
},
status: {
  type: String,
  enum: ['paid', 'rejected', 'pending'],
  default: 'pending'
}
  
}, { timestamps: true });

const WithdrawRequests= mongoose.model("withdrawRequests", withdrawRequestsSchema);

module.exports = WithdrawRequests;