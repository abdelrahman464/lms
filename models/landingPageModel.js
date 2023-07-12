const mongoose = require("mongoose");

const landingPageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  videoUrl: {
    type: String,
    required: true,
  },
  isDefault: {
    type: Boolean,
    default: false
  }
});

const LandingPage = mongoose.model("landingPage", landingPageSchema);

module.exports = LandingPage;
