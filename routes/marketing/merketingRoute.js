const express = require("express");
const authServices = require("../../services/authServices");
const {
  inviteOthers,
  calculateProfitsManual,
  startMarketing,
  getMyMarketLog,
  getMarketLog,
  createInvoiceForAllUsers,
  getMarketerChildren,
  getCustomerChildren,
  updateBroker,
} = require("../../services/marketing/marketingService");

const {
  validateMarketerAuthority,
} = require("../../middlewares/marketingMiddleware");

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

router.get(
  "/getMarketerChildren/:marketerId",
  authServices.protect,
  validateMarketerAuthority,
  getMarketerChildren
);
router.get(
  "/getCustomerChildren/:marketerId",
  authServices.protect,
  validateMarketerAuthority,
  getCustomerChildren
);

router.put(
  "/updateBroker",
  authServices.protect,
  authServices.allowedTo("admin"),
  updateBroker
);

module.exports = router;
