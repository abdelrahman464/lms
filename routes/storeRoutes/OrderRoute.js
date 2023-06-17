const express = require("express");
const authServices = require("../../services/authServices");
const {
  createCashOrder,
  findSpecificOrder,
  findAllOrders,
  filterOrderForLoggedUser,
  updateOrderToDelivered,
  updateOrderToPay,
  checkoutSession,
} = require("../../services/storeServices/OrderService");

const router = express.Router();

router.use(authServices.protect);

router.get(
  "/checkout-session/:cartId",
  authServices.allowedTo("user"),
  checkoutSession
);

router.route("/:cartId").post(authServices.allowedTo("user"), createCashOrder);
router
  .route("/")
  .get(
    authServices.allowedTo("user", "admin", "manager"),
    filterOrderForLoggedUser,
    findAllOrders
  );
router.route("/:id").get(authServices.allowedTo("admin"), findSpecificOrder);
router
  .route("/:id/pay")
  .put(authServices.allowedTo("admin", "manager"), updateOrderToPay);
router
  .route("/:id/deliver")
  .put(authServices.allowedTo("admin", "manager"), updateOrderToDelivered);
module.exports = router;
