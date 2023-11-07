const express = require("express");
const authServices = require("../../services/authServices");
const {
  createWithdrawRequest,
  getAllWithdrawRequests,
  getWithdrawRequestbyId,
  deleteWithdrawRequest,
} = require("../../services/marketing/withdrawReqService");

const router = express.Router();
router
  .route("/")
  .post(createWithdrawRequest)
  .get(authServices.protect, getAllWithdrawRequests);

router
  .route("/:id")
  .get(getWithdrawRequestbyId)
  .delete(deleteWithdrawRequest);


module.exports = router;
