const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const asyncHandler = require("express-async-handler");
const {
  uploadMixOfImages,
} = require("../../middlewares/uploadImageMiddleware");
const Product = require("../../models/storeModels/storeProductModel");
const factory = require("../handllerFactory");

exports.uploadProductImages = uploadMixOfImages([
  {
    name: "imageCover",
    maxCount: 1,
  },
  {
    name: "images",
    maxCount: 5,
  },
  {
    name: "pdf",
    maxCount: 1,
  },
]);

//image processing
exports.resizeProductImages = asyncHandler(async (req, res, next) => {
  //1- Image processing for imageCover
  if (req.files.imageCover) {
    const imageCoverFileName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;

    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/store/products/${imageCoverFileName}`);

    // Save image into our db
    req.body.imageCover = imageCoverFileName;
  }
  //2- Image processing for images
  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (img, index) => {
        const imageName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;

        await sharp(img.buffer)
          .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({ quality: 95 })
          .toFile(`uploads/store/products/${imageName}`);

        // Save image into our db
        req.body.images.push(imageName);
      })
    );
  }
  // 3. PDF processing
  if (req.files.pdf) {
    const pdfFile = req.files.pdf[0];
    const pdfFileName = `product-pdf-${uuidv4()}-${Date.now()}.pdf`;

    // Save the PDF file
    // await req.files.pdf[0].mv(`uploads/store/products/pdf/${pdfFileName}`);

    const pdfPath = `uploads/store/products/pdf/${pdfFileName}`;

    // Save the PDF file using fs
    fs.writeFileSync(pdfPath, pdfFile.buffer);
    // Save PDF into our db
    req.body.pdf = pdfFileName;
  }
  next();
});
exports.convertToArray = (req, res, next) => {
  if (req.body.subCategories) {
    // If it's not an array, convert it to an array
    if (!Array.isArray(req.body.subCategories)) {
      req.body.subCategories = [req.body.subCategories];
    }
  }
  next();
};

//@desc get list of products
//@route GET /api/v1/products
//@access public
exports.getProducts = factory.getALl(Product);
//@desc get specific product by id
//@route GET /api/v1/products/:id
//@access public
exports.getProduct = factory.getOne(Product, "reviews");
//@desc create product
//@route POST /api/v1/products
//@access private
exports.createProduct = factory.createOne(Product);
//@desc update specific product
//@route PUT /api/v1/products/:id
//@access private
exports.updateProduct = factory.updateOne(Product);
//@desc delete product
//@route DELETE /api/v1/products/:id
//@access private
exports.deleteProduct = factory.deleteOne(Product);
