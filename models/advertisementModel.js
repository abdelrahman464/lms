const mongoose = require("mongoose");

const advertisementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    type: String,
    required: true,
  },
  link: String,
});

const setImageURL = (doc) => {
  //return image base url + iamge name
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/advertisement/${doc.image}`;
    doc.image = imageUrl;
  }
};
//after initializ the doc in db
// check if the document contains image
// it work with findOne,findAll,update
advertisementSchema.post("init", (doc) => {
  setImageURL(doc);
});
// it work with create
advertisementSchema.post("save", (doc) => {
  setImageURL(doc);
});

const advertisement = mongoose.model("Advertisement", advertisementSchema);

module.exports = advertisement;
