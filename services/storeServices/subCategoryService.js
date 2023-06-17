const SubCategory = require("../../models/storeModels/subCategoryModel");
const factory = require("../handllerFactory");

// middleware to add categoryId to body
exports.setCategoryIdToBody = (req, res, next) => {
  //Nested Route
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

//filter subCategories in specefic category by categoryId
exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) filterObject = { category: req.params.categoryId };
  req.filterObj = filterObject;
  next();
};
//@desc get list of subcategories
//@route GET /api/v1/subCategories
//@access public
exports.getSubCategories = factory.getALl(SubCategory);
//@desc get specific subCategories by id
//@route GET /api/v1/subCategories/:id
//@access public
exports.getSubCategory = factory.getOne(SubCategory);
//@desc create subCategory
//@route POST /api/v1/subcategories
//@access private
exports.createSubCategory = factory.createOne(SubCategory);
//@desc update specific subCategory
//@route PUT /api/v1/subCategories/:id
//@access private
exports.updateSubCategory = factory.updateOne(SubCategory);
//@desc delete subCategory
//@route DELETE /api/v1/subCategories/:id
//@access private

exports.deleteSubCategory = factory.deleteOne(SubCategory);
