const express = require("express");
const authServices = require("../../services/authServices");
const {
  inviteOthers,
  calculateProfits,
  calculateTotalProfitsForLog,
  getMarketLog,
} = require("../../services/marketing/marketingService");

const router = express.Router();
router.get("/inviteOthers", authServices.protect, inviteOthers);
router.get("/calculateProfits", calculateProfits);
// router.get("/calculateTotalProfits", calculateTotalProfitsForLog);
// router.get("/getMarketLog/:marketerId", getMarketLog);
// router.put("/becomeMarketer", authServices.protect, becomeMarketer);
module.exports = router;
