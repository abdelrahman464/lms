const Live=require("../../models/educationModel/educationLiveModel");
const factory=require("../handllerFactory");


// Create a new live
exports.createLive= factory.createOne(Live);
//---------------------------------------------------------------------------------//

// Get all lives
exports.getAllLives = factory.getALl(Live);
//---------------------------------------------------------------------------------//

// Get a specific live by ID
exports.getLivebyId = factory.getOne(Live);
//---------------------------------------------------------------------------------//

// Update a live by ID
exports.updateLive= factory.updateOne(Live);
//---------------------------------------------------------------------------------//

// Delete a live  by ID
exports.deleteLive= factory.deleteOne(Live);
//---------------------------------------------------------------------------------//
exports.followLive = async (req, res) => {
    try {
      const { liveId } = req.params;
      const live = await Live.findById(liveId);
  
      if (!live) {
        return res.status(400).json({ msg: "live not found" });
      }
  
      const userIsFollower = live.followers.some((follower) => follower.user.toString() === req.user._id.toString());
  
      if (userIsFollower) {
        return res.status(400).json({ msg: "you have already followed this live" });
      }
  
      const newFollower = {
        user: req.user._id,
        email: req.user.email
      };
  
      live.followers.push(newFollower);
      await live.save();
  
      res.status(200).json({ msg: "you have followed this live" });
    } catch (error) {
      res.status(500).json({ msg: "Internal server error" });
    }
  };