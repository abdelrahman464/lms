const Package = require("../../models/educationModel/educationPackageModel");
const factory = require("./handllerFactory");

exports.convertToArray = async (req, res, next) => {
  if (req.body.courses) {
    // If it's not an array, convert it to an array
    if (!Array.isArray(req.body.courses)) {
      req.body.courses = [req.body.courses];
    }
  }
  next();
};
// Create a new package
exports.createPackage = factory.createOne(Package);
// Get all packages
exports.getAllPackages = factory.getALl(Package);
// Get a specific package by ID
exports.getPackageById = factory.getOne(Package);
// Update a package by ID
exports.updatePackage = factory.updateOne(Package);
// Delete a package by ID
exports.deletePackage = factory.deleteOne(Package);
