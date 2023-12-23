const factory = require("../handllerFactory");
const Brocker = require("../../models/marketingModels/brockerModel");

//@desc get list of Brockers
//@route GET /api/v1/brockers
//@access public
exports.getAllBrockers = factory.getALl(Brocker);
//@desc get specific brocker by id
//@route GET /api/v1/brockers/:id
//@access public
exports.getBrocker = factory.getOne(Brocker);
//@desc create Brocker
//@route POST /api/v1/brockers
//@access private
exports.createBrocker = factory.createOne(Brocker);
//@desc update specific Brocker
//@route PUT /api/v1/brockers/:id
//@access private
exports.updateBrocker = factory.updateOne(Brocker);
//@desc delete Brocker
//@route DELETE /api/v1/brockers/:id
//@access private
exports.deleteBrocker = factory.deleteOne(Brocker);
//@desc get suitable brocker
//@route GET /api/v1/brockers/suitable
//@access private

exports.getSuitableBrocker = async (req, res, next) => {
  //the i option in the regular expression makes the comparison case-insensitive. This means that it will match documents where the country field contains the specified country value regardless of the case.
  const brockers = await Brocker.find({
    country: { $regex: new RegExp(req.user.country, "i") },
  });

  console.log(req.user.country);
  if (!brockers) {
    return res.status(200).json({
      status: "faild",
      msg: "no brockers found",
    });
  }
  return res.status(200).json({
    status: "success",
    data: brockers,
  });
};
