const express = require("express");
const authServices = require("../../services/authServices");
const {
  findSpecificOrder,
  findAllOrders,
  filterOrderForLoggedUser,
  checkoutSession,
} = require("../../services/educationServices/OrderService");

const router = express.Router();

router.use(authServices.protect);

router.get(
  "/checkout-session/:cartId",
  authServices.allowedTo("user"),
  checkoutSession
);

router
  .route("/")
  .get(
    authServices.allowedTo("user", "admin"),
    filterOrderForLoggedUser,
    findAllOrders
  );
router.route("/:id").get(authServices.allowedTo("admin"), findSpecificOrder);
module.exports = router;
