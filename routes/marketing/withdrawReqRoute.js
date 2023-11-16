const express = require("express");
const authServices = require("../../services/authServices");
const {
  createWithdrawRequest,
  getAllRequestedInvoices,
  getWithdrawRequestbyId,
  payToMarketer,
} = require("../../services/marketing/withdrawReqService");

const router = express.Router();
router.route("/").post(authServices.protect, createWithdrawRequest);
router.route("/:status?").get(authServices.protect, getAllRequestedInvoices);

router.route("/:id").get(getWithdrawRequestbyId);
router.route("/payToMarketer/:id").put(payToMarketer);

module.exports = router;
