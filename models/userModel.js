const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const userShcema = new mongoose.Schema(
  {
    invitor:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default:null
    },
    name: {
      type: String,
      trim: true,
      required: [true, "name required"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "email required"],
      unique: true,
      lowercase: true,
    },
    emailVerifiedAt: Date,
    emailVerifyCode: String,
    emailVerifyExpires: Date,
    emailVerified: Boolean,
    googleId: {
      type: String,
      unique: true,
    },
    phone: String,
    country:String,
    profileImg: String,
    password: {
      type: String,
      required: [true, "password required"],
      minlength: [8, "too short Password"],
    },
    passwordChangedAt: Date,
    passwordResetCode: String,
    passwordResetExpires: Date,
    passwordResetVerified: Boolean,
    role: {
      type: String,
      enum: ["user", "instructor", "admin","marketer"],
      default: "user",
    },
    active: {
      type: Boolean,
      default: false,
    },
    about: String,
    //child references (1- manny )
    storeWishlist: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "StoreProduct",
      },
    ],
    educationWishlist: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "EducationCourses",
      },
    ],
    addresses: [
      {
        id: { type: mongoose.Schema.Types.ObjectId },
        alias: String,
        details: String,
        phone: String,
        city: String,
        postalCode: String,
      },
    ],
  },
  { timestamps: true }
);

userShcema.pre("save", async function (next) {
  //if password field is not modified go to next middleware
  if (!this.isModified("password")) return next();
  // Hashing user password
  this.password = await bcrypt.hash(this.password, 12);

  next();
});

const setProfileImageURL = (doc) => {
  //return image base url + iamge name
  if (doc.profileImg) {
    const profileImageUrl = `${process.env.BASE_URL}/users/${doc.profileImg}`;
    doc.profileImg = profileImageUrl;
  }
};
//after initializ the doc in db
// check if the document contains image
// it work with findOne,findAll,update
userShcema.post("init", (doc) => {
  setProfileImageURL(doc);
});
// it work with create
userShcema.post("save", (doc) => {
  setProfileImageURL(doc);
});

const User = mongoose.model("User", userShcema);
module.exports = User;
