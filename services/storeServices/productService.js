const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const asyncHandler = require("express-async-handler");
const {
  uploadMixOfImages,
} = require("../../middlewares/uploadImageMiddleware");
const Product = require("../../models/storeModels/storeProductModel");
const factory = require("../handllerFactory");
const ApiFeatures = require("../../utils/apiFeatures");
const ApiError = require("../../utils/apiError");
const Order = require("../../models/storeModels/storeOrderModel");

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
//filter pruducts to each user
exports.createFilterObjMyProducts = asyncHandler(async (req, res, next) => {
  let filterObject = {};
  const order = await Order.find({ user: req.user._id, isPaid: true });
  const userProducts = [];

  order.forEach((item) => {
    item.cartItems.forEach((cartItem) => {
      userProducts.push(cartItem.product._id.toString());
    });
  });

  filterObject = {
    _id: { $in: userProducts },
  };
  req.filterObj = filterObject;
  next();
});
//@desc get list of products
//@route GET /api/v1/products
//@access public
exports.getMyProducts = factory.getALl(Product);
exports.getProducts = asyncHandler(async (req, res) => {
  let filter = {};
  if (req.filterObj) {
    filter = req.filterObj;
  }
  const documentsCounts = await Product.countDocuments();
  const apiFeatures = new ApiFeatures(Product.find(filter, "-pdf"), req.query)
    .paginate(documentsCounts)
    .filter()
    .search(Product)
    .limitFields()
    .sort();

  const { mongooseeQuery, paginationResult } = apiFeatures;
  const documents = await mongooseeQuery;

  res
    .status(200)
    .json({ results: documents.length, paginationResult, data: documents });
});
//@desc get specific product by id
//@route GET /api/v1/products/:id
//@access public
exports.getProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const filter = req.filterObj;
  const userProducts = filter._id.$in;

  let product = {};

  if (userProducts.includes(id.toString())) {
    product = await Product.findById(id).populate("reviews");
  } else {
    product = await Product.findById(id, "-pdf").populate("reviews");
  }

  if (!product) {
    return next(new ApiError(`Product Not Found`, 404));
  }
  res.status(200).json({ data: product });
});
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
//@desc get free product
//@route DELETE /api/v1/products/getFree/:productId
//@access private
exports.getFreeProduct = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;

  const product = await Product.findById(productId);
  if (!product) return next(new ApiError("Product Not Found", 404));
  if (product.isFree === false) {
    return next(new ApiError("Product Is Not Free", 400));
  }
  const userOrders = await Order.find({ user: req.user._id, isPaid: true });
  const userProducts = [];

  userOrders.forEach((item) => {
    item.cartItems.forEach((cartItem) => {
      userProducts.push(cartItem.product._id.toString());
    });
  });
  if (userProducts.includes(productId.toString())) {
    return next(new ApiError("You already have this product", 400));
  }
  const cartItems = [
    {
      product: productId,
      quantity: 1,
      price: 0,
    },
  ];
  //3)create order with default payment method cash
  const order = await Order.create({
    user: req.user._id,
    cartItems: cartItems,
    totalOrderPrice: product.price,
    isPaid: true,
    paidAt: Date.now(),
    paymentMethodType: "free",
  });
  //4) after creating order  decerement product quantity and increment product sold
  if (order) {
    product.sold += 1;
    await product.save();
  }
  res.status(201).json({ status: "success" });
});
