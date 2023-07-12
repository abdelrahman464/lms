const mongoose = require("mongoose");

const educationLiveSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  day:{
    type:Number,
    required:[true,"which day the live will be ?"]
  },
  month:{
    type:Number,
    required:[true,"which month the live will be ?"]
  },
  hour:{
    type:String,
    required:[true,"which hour the live will be ?"]
  },
  duration:{
    type:Number,
    required:[true,"what is the duration of the live will be ?"]
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "EducationCourse",
  },
  link: {
    type: String,
  },
});

const Live = mongoose.model("Educationlive", educationLiveSchema);

module.exports = Live;
