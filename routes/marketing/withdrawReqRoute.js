const express = require("express");
const authServices = require("../../services/authServices");
const {
  canSendWithdrawRequest,
  createWithdrawRequest,
  getAllWithdrawRequests,
  getWithdrawRequestbyId,
  deleteWithdrawRequest,
  payToMarketer,
} = require("../../services/marketing/withdrawReqService");

const router = express.Router();
router
  .route("/")
  .post(authServices.protect,canSendWithdrawRequest ,createWithdrawRequest)
  .get(authServices.protect, getAllWithdrawRequests);

router.route("/:id").get(getWithdrawRequestbyId).delete(deleteWithdrawRequest);
router.route("/payToMarketer/:id").put(payToMarketer);

module.exports = router;
