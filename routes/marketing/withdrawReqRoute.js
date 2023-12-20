const express = require("express");
const authServices = require("../../services/authServices");
const {
  requestInvoice,
  getAllRequestedInvoices,
  getWithdrawRequestbyId,
  payToMarketer,
} = require("../../services/marketing/withdrawReqService");
const {
  checkIdValidator,
  checkStatusValidator,
} = require("../../utils/validators/martingValidator/withdrawRequestsValidator");
const router = express.Router();


router.route("/").post(authServices.protect, requestInvoice);
router
  .route("/:status?")
  .get(authServices.protect, checkStatusValidator, getAllRequestedInvoices);

router
  .route("/:id")
  .get(
    authServices.protect,
    authServices.allowedTo("admin"),
    checkIdValidator,
    getWithdrawRequestbyId
  );
router
  .route("/payToMarketer/:invoiceId")
  .put(
    authServices.protect,
    authServices.allowedTo("admin"),
    checkIdValidator,
    payToMarketer
  );

module.exports = router;
