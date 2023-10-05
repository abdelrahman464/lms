const mongoose = require("mongoose");

const MarketingLogsSchema = new mongoose.Schema({
  marketer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  balance: {
    type: Number,
    default:0
  },
  transactions:[{
    childEmail:String,
    amount:Number,
    Paid:{
      type:Boolean,
      default:false
    },
    generation:{
        type:Number,
        Enum:[1,2,3,4]
    },
    Date:{
        type:Date,
        default:Date.now()
    }
  }],
  
}, { timestamps: true });

const MarketingLog = mongoose.model("MarketingLogs", MarketingLogsSchema);

module.exports = MarketingLog;