const factory = require("../handllerFactory");
const Brocker = require("../../models/marketingModels/brockerModel");
const User = require("../../models/userModel");

const updateChildren = async (marketerId) => {
  try {
    await User.updateOne({ _id: marketerId }, { brocker: { type: "me" } });

    let parentIds = [marketerId];
    let type = "direct_parent";
    let hasChildren = true;

    while (hasChildren) {
      // Bulk update for efficiency
      const updateResult = await User.updateMany(
        { invitor: { $in: parentIds } },
        { $set: { brocker: { type, parentId: marketerId } } }
      );

      if (updateResult.modifiedCount === 0) {
        hasChildren = false;
        console.log("No more children to update");
        break;
      }

      // Fetch only the _id field to minimize data transfer
      const childrenIds = await User.find(
        { invitor: { $in: parentIds } },
        { _id: 1 }
      ).lean();

      parentIds = childrenIds.map((child) => child._id);

      type = "tree_parent";
    }

    console.log("Update process completed successfully");
    return true;
  } catch (error) {
    console.error("Error in updateChildren:", error);
    throw error;
  }
};

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
exports.createBrocker = async (req, res) => {
  try {
    const brocker = await Brocker.create(req.body);
    if (brocker.marketer) {
      const marketerBrockers = await Brocker.find({
        marketer: brocker.marketer,
      });
      //update his children only if this is the first time , if he has more than one brocker then it's mean his children already updated and they carry the brocker to new signups ,so no need to update them
      if (marketerBrockers.length === 1) {
        await updateChildren(brocker.marketer);
      }
    }
    return res.status(201).json({
      status: "success",
      data: brocker,
    });
  } catch (error) {
    console.error("Error in createBrocker:", error);
    return res.status(500).json({
      status: "error",
      msg: "Internal server error",
    });
  }
};
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
    //1-----check if the marketer or his parent has brocker
    if (req.user.brocker) {
      let invitorBrockers = null;
      if (req.user.brocker.type === "me") {
        invitorBrockers = await Brocker.find({
          marketer: req.user._id,
        });
      } else {
        invitorBrockers = await Brocker.find({
          marketer: req.user.brocker.parentId,
        });
      }
      if (invitorBrockers) {
        return res.status(200).json({
          status: "success",
          length: invitorBrockers.length,
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
      length: brockers.length,
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
// Check if there are brokers with the condition marketer:req.user.invitor
//1-check if the marketer has brocker
//2- if not get marketer invitor and check if HIS invitor has brocker
//3-repeat this untill find brocker or reach the top of the tree

// Example usage:
// Assuming marketerId is the ID of the root marketer
