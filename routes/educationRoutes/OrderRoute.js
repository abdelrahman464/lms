const express = require("express");
const authServices = require("../../services/authServices");
const {
  findSpecificOrder,
  findAllOrders,
  filterOrderForLoggedUser,
  checkoutSession,
  checkoutSessionCoinBase,
} = require("../../services/educationServices/OrderService");

const router = express.Router();

router.use(authServices.protect);

router.put(
  "/checkout-session/:packageId",
  authServices.protect,
  authServices.allowedTo("user", "instructor"),
  checkoutSession
);
router.get("/coinbase/:packageId", checkoutSessionCoinBase);

router
  .route("/")
  .get(
    authServices.allowedTo("user", "admin", "instructor"),
    filterOrderForLoggedUser,
    findAllOrders
  );
router.route("/:id").get(authServices.allowedTo("admin"), findSpecificOrder);
module.exports = router;
