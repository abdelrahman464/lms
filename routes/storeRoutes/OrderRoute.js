const express = require("express");
const authServices = require("../../services/authServices");
const {
  findSpecificOrder,
  findAllOrders,
  filterOrderForLoggedUser,
  checkoutSession,
  checkoutStoreCoinBase
} = require("../../services/storeServices/OrderService");

const router = express.Router();


router.use(authServices.protect);
router.get(
  "/checkout-session/:cartId",
  authServices.allowedTo("user", "instructor"),
  checkoutSession
);
router.get("/coinbase/:cartId", checkoutStoreCoinBase);


router
  .route("/")
  .get(
    authServices.allowedTo("user", "instructor", "admin"),
    filterOrderForLoggedUser,
    findAllOrders
  );
router.route("/:id").get(authServices.allowedTo("admin"), findSpecificOrder);
module.exports = router;
