const mongoose = require("mongoose");

//when return his unDirect transaction 
  //loop on this array and return his total profits 
//calculate his total   
const MarketingLogsSchema = new mongoose.Schema({
  
  role: {
    type: String,
    enum: ["customer","marketer"],
  },
  invitor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  marketer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  percentage: { //mySales + customerSales => percentage
    type: Number,
    default:0
  },
  totalSalesMoney: { //total sales' money i have sold 
    type: Number,
    default:0
  },
  profits: { //total sales' money i have sold 
    type: Number,
    default:0
  },
  mySales: { //number of directSales i have made 
    type: Number,
    default:0
  },
  customerSales: { //sales i earn from customer under me (not marketer) 
    type: Number,
    default:0
  },
  //what i get from my tree and which level?
  transactions:[{
    childEmail:String,
    amount:Number,
    calculated:{ //when we create final invoice this key will be true 
      type:Boolean,
      default:false
    },
    generation:{
        type:Number,
        Enum:[1,2,3,4,5]
    },
    Date:{
        type:Date,
        default:Date.now()
    }
  }],
  //direct sales --> level 1 , under me 
  direct_transactions:[{
    childEmail:String,
    amount:Number,
    Paid:{
      type:Boolean,
      default:false
    },
    Date:{
        type:Date,
        default:Date.now()
    }
  }],
  //when we pay to marketer we save invoice here
  invoices:[{
    amount:Number,
    desc:String,
    Date:{
        type:Date,
       }
  }],
}, { timestamps: true });

const MarketingLog = mongoose.model("MarketingLogs", MarketingLogsSchema);

module.exports = MarketingLog;