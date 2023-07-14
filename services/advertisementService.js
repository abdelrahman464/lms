const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");
const Advertisement = require("../models/advertisementModel");
const factory = require("./handllerFactory");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");

//upload Singel image
exports.uploadAdvertisementImage = uploadSingleImage("image");
//image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `advertisement-${uuidv4()}-${Date.now()}.jpeg`;

  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/advertisement/${filename}`);

    //save image into our db
    req.body.image = filename;
  }

  next();
});

//@desc get list of advertisements
//@route GET /api/v1/advertisements
//@access public
exports.getAllAdvertisements = factory.getALl(Advertisement);
//@desc get specific advertisement by id
//@route GET /api/v1/advertisements/:id
//@access public
exports.getAdvertisement = factory.getOne(Advertisement);
//@desc create advertisement
//@route POST /api/v1/advertisements
//@access public
exports.createAdvertisement = factory.createOne(Advertisement);
//@desc update specific advertisement
//@route PUT /api/v1/advertisements/:id
//@access public
exports.updateAdvertisement = factory.updateOne(Advertisement);
//@desc delete advertisement
//@route DELETE /api/v1/advertisements/:id
//@access public
exports.deleteAdvertisement = factory.deleteOne(Advertisement);
