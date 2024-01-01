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
  try {
    //1-----check if marketer has brocker
    // Check if there are brokers with the condition marketer:req.user.invitor
    if (req.user.invitor) {
      const invitorBrockers = await Brocker.find({
        marketer: req.user.invitor,
      });
      if (invitorBrockers.length > 0) {
        console.log("Found brokers for invitor:", req.user.invitor);
        return res.status(200).json({
          status: "success",
          data: invitorBrockers,
        });
      }
    }
    //2-----check if there are Borkers in his country
    //the i option in the regular expression makes the comparison case-insensitive. This means that it will match documents where the country field contains the specified country value regardless of the case.
    const brockers = await Brocker.find({
      country: { $regex: new RegExp(req.user.country, "i") },
    });

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
  } catch (error) {
    console.error("Error in getSuitableBrocker:", error);
    return res.status(500).json({
      status: "error",
      msg: "Internal server error",
    });
  }
};
