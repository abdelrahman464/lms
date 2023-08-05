const mongoose = require("mongoose");

const storiesSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
  video: {
    type: String,
    required: true,
  }
});

const Story = mongoose.model("stories", storiesSchema);

module.exports = Story;
