const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const Brand = require("../../models/storeModels/brandModel");
const factory = require("../handllerFactory");
const {
  uploadSingleImage,
} = require("../../middlewares/uploadImageMiddleware");

//upload Singel image
exports.uploadCategoryImage = uploadSingleImage("image");
//image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`;

  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })

      .toFile(`uploads/store/brands/${filename}`);

    //save image into our db
    req.body.image = filename;
  }

  next();
});
//@desc get list of brand
//@route GET /api/v1/brands
//@access public
exports.getBrands = factory.getALl(Brand);
//@desc get specific brand by id
//@route GET /api/v1/brand/:id
//@access public
exports.getBrand = factory.getOne(Brand);

//@desc create brand
//@route POST /api/v1/brands
//@access private
exports.createBrand = factory.createOne(Brand);
//@desc update specific brand
//@route PUT /api/v1/brand/:id
//@access private
exports.updateBrand = factory.updateOne(Brand);
//@desc delete brand
//@route DELETE /api/v1/brand/:id
//@access private
exports.deleteBrand = factory.deleteOne(Brand);
