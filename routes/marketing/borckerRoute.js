const express = require("express");

const {
  BrockerIdCheckerValidator,
  createBrockerValidator,
  updateBrockerValidator,
} = require("../../utils/validators/martingValidator/brockerValidator");
const authServices = require("../../services/authServices");
const {
  getAllBrockers,
  getBrocker,
  createBrocker,
  updateBrocker,
  deleteBrocker,
} = require("../../services/marketing/brockerService");

const router = express.Router();

router
  .route("/")
  .get(authServices.protect, getAllBrockers)
  .post(
    authServices.protect,
    authServices.allowedTo("admin"),
    createBrockerValidator,
    createBrocker
  );
router
  .route("/:id")
  .get(BrockerIdCheckerValidator, getBrocker)
  .put(
    authServices.protect,
    authServices.allowedTo("admin"),
    updateBrockerValidator,
    updateBrocker
  )
  .delete(
    authServices.protect,
    authServices.allowedTo("admin"),
    BrockerIdCheckerValidator,
    deleteBrocker
  );

module.exports = router;
