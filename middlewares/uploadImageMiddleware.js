const multer = require("multer");

const ApiError = require("../utils/apiError");

const multerOptions = () => {
  //memory stroge engine
  const multerStorage = multer.memoryStorage();

  const multterFilter = function (req, file, cb) {
    if (
      file.mimetype.startsWith("image") ||
      file.mimetype === "application/pdf"
    ) {
      cb(null, true);
    } else {
      cb(new ApiError("Only image Allowed", 400), false);
    }
  };
  const upload = multer({ storage: multerStorage, fileFilter: multterFilter });
  return upload;
};

exports.uploadSingleImage = (fieldName) => multerOptions().single(fieldName);
exports.uploadMixOfImages = (arrayOfFields) =>
  multerOptions().fields(arrayOfFields.concat({ name: "pdf", maxCount: 1 }));
