const mongoose = require("mongoose");

const educationPackageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  sold: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, "Package price is required"],
    trim: true,
    max: [200000, "Too long Package price"],
  },
  priceAfterDiscount: {
    type: Number,
    trim: true,
    max: [200000, "Too long Package priceAfterDiscount"],
  },
  expirationTime: {
    //0  //30   //  //expirtaioInDays
    type: Number,
    required: [true, "expirationTime required"],
  },
  image: String,

  courses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EducationCourse",
    },
  ],
  allCourses: {
    type: Boolean,
    default: false,
  },
  telegramChannelNames: [
    {
      type: String,
    },
  ],
  users: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      telgramId: String,
      start_date: {
        type: Date,
        required: true,
      },
      end_date: {
        type: Date,
        required: true,
      },
    },
  ],
  type: {
    type: String,
    enum: ["course", "package"],
    default: "package",
  },
  renewPrice: {
    type: Number,
    trim: true,
    max: [200000, "Too long Package renew price"],
  },
});

const setImageURL = (doc) => {
  //return image base url + iamge name
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/education/packages/${doc.image}`;
    doc.image = imageUrl;
  }
};
//after initializ the doc in db
// check if the document contains image
// it work with findOne,findAll,update
educationPackageSchema.post("init", (doc) => {
  setImageURL(doc);
});
// it work with create
educationPackageSchema.post("save", (doc) => {
  setImageURL(doc);
});

educationPackageSchema.pre(/^find/, function (next) {
  this.populate({ path: "courses", select: "title" });
  next();
});

const Package = mongoose.model("EducationPackage", educationPackageSchema);

module.exports = Package;
