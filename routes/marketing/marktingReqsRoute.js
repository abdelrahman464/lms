const express = require("express");
const authServices = require("../../services/authServices");
const {
  createMarketingRequest,
  getAllMarketingRequests,
  getMarketingRequestbyId,
  deleteMarketingRequest,
  acceptMarketingRequest,
} = require("../../services/marketing/marketingReqService");
const {
  createmarketingReqValidator,
} = require("../../utils/validators/martingValidator/marketRequestsValidator");

const router = express.Router();
router
  .route("/")
  .post(authServices.protect,createmarketingReqValidator,createMarketingRequest)
  .get(authServices.protect, getAllMarketingRequests);

router
  .route("/:id")
  .get(getMarketingRequestbyId)
  .delete(deleteMarketingRequest);

router.route("/accept").put(acceptMarketingRequest);

module.exports = router;
