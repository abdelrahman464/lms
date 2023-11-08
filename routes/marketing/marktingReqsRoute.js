const express = require("express");
const authServices = require("../../services/authServices");
const {
  canSendMarketingRequest,
  createMarketingRequest,
  getAllMarketingRequests,
  getMarketingRequestbyId,
  deleteMarketingRequest,
  acceptMarketingRequest,
  rejectMarketingRequest,
} = require("../../services/marketing/marketingReqService");
const {
  createmarketingReqValidator,
} = require("../../utils/validators/martingValidator/marketRequestsValidator");

const router = express.Router();
router
  .route("/")
  .post(authServices.protect, canSendMarketingRequest, createMarketingRequest)
  .get(authServices.protect, getAllMarketingRequests);

router
  .route("/:id")
  .get(getMarketingRequestbyId)
  .delete(deleteMarketingRequest);

router.route("/accept/:id").put(acceptMarketingRequest);
router.route("/reject/:id").put(rejectMarketingRequest);

module.exports = router;