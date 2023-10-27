exports.approveMarketerRequest = async (req, res) => {
    try {
      const user = await User.findById(req.params.userId);
      //fill the form
      if (!user) {
        return res.status(400).json({
          status: "faild",
          msg: "user not found",
        });
      }
      // // Update the user's role to "marketer"
      user.role = "marketer";
  
      // Save the updated user
      await user.save();
      return res
        .status(200)
        .json({ status: "success", msg: "User role updated to marketer" });
    } catch (error) {
      return res
        .status(400)
        .json({ status: "faild", msg: `Error updating user role:${error}` });
    }
  };
  
 //2
//@desc change user role to marketer so his percentage will change form 25% to 35%
//@access public
exports.becomeMarketer = async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
  
      if (!user) {
        return res.status(403).json({ status: "faild", msg: "User Not Found" });
      }
      if (req.user.role === "marketer") {
        return res
          .status(400)
          .json({ status: "faild", msg: "you already a marketer" });
      }
      //fill the form
      const marketRequest = await MarketingRequests.create({
        user: req.user._id,
        //
      });
  
      if (!marketRequest) {
        return res.status(400).json({
          status: "faild",
          msg: "your request hasn't been submitted ,try again",
        });
      }
      return res
        .status(200)
        .json({ status: "success", msg: "User role updated to marketer" });
      // // Update the user's role to "marketer"
      // user.role = "marketer";
  
      // Save the updated user
      // await user.save();
    } catch (error) {
      return res
        .status(400)
        .json({ status: "faild", msg: `Error updating user role:${error}` });
    }
  };
   