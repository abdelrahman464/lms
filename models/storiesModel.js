const mongoose = require("mongoose");

const storiesSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
  video: {
    type: String,
    required: true,
  },
});
const setImageURL = (doc) => {
  //return image base url + iamge name
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/story/${doc.image}`;
    doc.image = imageUrl;
  }
};
//after initializ the doc in db
// check if the document contains image
// it work with findOne,findAll,update
storiesSchema.post("init", (doc) => {
  setImageURL(doc);
});
// it work with create
storiesSchema.post("save", (doc) => {
  setImageURL(doc);
});
const Story = mongoose.model("stories", storiesSchema);

module.exports = Story;
