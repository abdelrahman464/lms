const express = require("express");
const authServices = require("../../services/authServices");
const {
  inviteOthers,
  calculateProfitsManual,
  startMarketing,
  getMyMarketLog,
  getMarketLog,
  createInvoiceForAllUsers,
  getMyChildren,
  recalculateProfits,
} = require("../../services/marketing/marketingService");

const router = express.Router();
// router.get("/inviteOthers", authServices.protect, inviteOthers); //not used in production
router.put(
  "/calculateProfitsManual",
  authServices.protect,
  authServices.allowedTo("admin"),
  calculateProfitsManual
);
router.put(
  "/createInvoiceForAllUsers",
  authServices.protect,
  authServices.allowedTo("admin"),
  createInvoiceForAllUsers
);
router.put("/startMarketing", authServices.protect, startMarketing);
router.get("/getMyMarketLog", authServices.protect, getMyMarketLog);
router.get("/getMarketLog/:marketerId", authServices.protect, getMarketLog);
router.get("/getMyChildren/:marketerId", authServices.protect, getMyChildren);
router.get("/recalculateProfits", authServices.protect, recalculateProfits);

module.exports = router;
