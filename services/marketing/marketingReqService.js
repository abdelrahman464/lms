const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const asyncHandler = require("express-async-handler");
const MarketingRequest = require("../../models/marketingModels/MarketingRequests");
const MarketingLog = require("../../models/marketingModels/MarketingModel");
const factory = require("../handllerFactory");
const sendEmail = require("../../utils/sendEmail");
const ApiError = require("../../utils/apiError");
const User = require("../../models/userModel");

const {
  uploadMixOfImages,
} = require("../../middlewares/uploadImageMiddleware");
// const { all } = require("../../routes/marketing/marktingReqsRoute");

exports.filterAcceptReq = asyncHandler(async (req, res, next) => {
  req.body.status = "pending";
  next();
});
//----------------------------------------------------------------
exports.uploadMarketingRequestIdetity = uploadMixOfImages([
  {
    name: "identity",
    maxCount: 1,
  },
]);
//----------------------------------------------------------------
//image processing
exports.handleMarketingReqsIdentities = asyncHandler(async (req, res, next) => {
  // 3. PDF processing
  if (req.files.identity) {
    const pdfFile = req.files.identity[0];
    const pdfFileName = `marketingReq-Identity-${uuidv4()}-${Date.now()}.pdf`;
    // Save the PDF file
    // await req.files.pdf[0].mv(`uploads/store/products/pdf/${pdfFileName}`);

    const pdfPath = `uploads/marketing/identities/${pdfFileName}`;

    // Save the PDF file using fs
    fs.writeFileSync(pdfPath, pdfFile.buffer);
    // Save PDF into our db
    req.body.identity = pdfFileName;
    console.log(req.body.identity);
  }
  next();
});
//--------------------------------------------------------------------------------------------
exports.canSendMarketingRequest = async (req, res, next) => {
  const marketingRequest = await MarketingRequest.findOne({
    user: req.user._id,
  });
  // return res.json(withdrawRequest)
  console.log(marketingRequest);
  if (!marketingRequest) {
    return next();
  }
  if (marketingRequest.status === "pending") {
    return res.status(400).json({
      status: "faild",
      msg: "your request is pending , wait till admin review your request ",
    });
  }
  if (marketingRequest.status === "rejectd") {
    return res
      .status(400)
      .json({ status: "faild", msg: "your request was rejected " });
  }
  if (marketingRequest.status === "paid") {
    return res.status(400).json({
      status: "faild",
      msg: "your request was accepted and you was paid successfully",
    });
  }
  next();
};

//---------------------------------------------------------------------------------------------------//
// Create a new MarketingRequests
exports.createMarketingRequest = async (req, res) => {
  // return res.json(req.body);
  // Parse the date string to convert it into the Date data type
  const dateParts = req.body.birthDate.split("/"); // Assuming date format is day/month/year
  const formattedDate = new Date(
    `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`
  );

  req.body.user = req.user._id;
  req.body.birthDate = formattedDate;
  const request = await MarketingRequest.create(req.body);
  await MarketingLog.findOneAndUpdate(
    { marketer: req.user._id },
    { hasSentRequest: true }
  );
  return res.status(200).json({ date: request });
};
//---------------------------------------------------------------------------------//
// Get all MarketingRequests
exports.getAllMarketingRequests = async (req, res) => {
  let { status } = req.query;
  if (!status) {
    status = "pending";
  } else if (status === "all") {
    status = null;
  }
  const marketingRequests = await MarketingRequest.find({ status });
  return res.status(200).json({ status: "success", data: marketingRequests });
};
//---------------------------------------------------------------------------------//
// Get a specific MarketingRequests by ID
exports.getMarketingRequestbyId = factory.getOne(MarketingRequest);
//---------------------------------------------------------------------------------//
// Delete a MarketingRequests  by ID
exports.deleteMarketingRequest = factory.deleteOne(MarketingRequest);
//---------------------------------------------------------------------------------//
// Update a MarketingRequests by ID
exports.acceptMarketingRequest = async (req, res, next) => {
  const { id } = req.params;

  //get user marketLog and update his role
  const MarketRequest = await MarketingRequest.findOneAndUpdate(
    { _id: id },
    { status: "accepted" }
  );

  await MarketingLog.findOneAndUpdate(
    { marketer: MarketRequest.user },
    { role: "marketer" }
  );
  //SEND EMAIL TO   MarketRequest.user Telling him he he been marketer
  const userInRequset = await User.findById(MarketRequest.user);
  try {
    const emailMessage = `Hi ${userInRequset.name}, 
                          \n your request to be a marketer has been accepted by the admin
                          \n please login to your account to see your new role
                          \n the new-normal Team`;

    await sendEmail({
      to: userInRequset.email,
      subject: "Your Request To Be A Marketer Has Been Accepted",
      text: emailMessage,
    });
  } catch (err) {
    return next(
      new ApiError("there is a problem with sending Email to the user ", 500)
    );
  }
  return res.status(200).json({ status: "status updated successfully" });
};
//---------------------------------------------------------------------------------//
// reject a MarketingRequests by ID
exports.rejectMarketingRequest = async (req, res, next) => {
  const { id } = req.params;

  //get user marketLog and update his role
  const MarketRequest = await MarketingRequest.findOneAndUpdate(
    { _id: id },
    { status: "reject" }
  );
  //SEND EMAIL TO   MarketRequest.user Telling him he he been marketer
  const userInRequset = await User.findById(MarketRequest.user);
  try {
    const emailMessage = `Hi ${userInRequset.name}, 
                          \n your request to be a marketer has been rejected by the admin
                          \n please try again later
                          \n the New-Normal Team`;

    await sendEmail({
      to: userInRequset.email,
      subject: "Your Request To Be A Marketer Has Been Rejected",
      text: emailMessage,
    });
  } catch (err) {
    return next(
      new ApiError("there is a problem with sending Email to the user ", 500)
    );
  }

  return res.status(200).json({ status: "status was rejected successfully" });
};
