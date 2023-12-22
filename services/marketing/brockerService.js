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
