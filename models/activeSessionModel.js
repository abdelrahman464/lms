const mongoose = require("mongoose");

const activeSessionSchema=new mongoose.Schema({

      email: {
        type: String,
        lowercase: true,
      },
      token:{
        type:String
      }

})
const ActiveSession = mongoose.model("activeSession", activeSessionSchema);
module.exports = ActiveSession;
