const express = require("express");
const authServices = require("../../services/authServices");
const {
  inviteOthers,
  calculateProfits,
  startMarketing,
  getMyMarketLog,
  getMarketLog,
  createInvoiceForAllUsers,
  getMyChildren,
} = require("../../services/marketing/marketingService");

const router = express.Router();
router.get("/inviteOthers", authServices.protect, inviteOthers);
router.get("/calculateProfits", calculateProfits);
router.put("/createInvoiceForAllUsers", createInvoiceForAllUsers);
router.put("/startMarketing", authServices.protect, startMarketing);
router.get("/getMyMarketLog", authServices.protect, getMyMarketLog);
router.get("/getMarketLog/:marketerId", getMarketLog);
router.get("/getMyChildren/:marketerId", authServices.protect, getMyChildren);

module.exports = router;
