const express = require("express");
const authServices = require("../../services/authServices");
const {
  findSpecificOrder,
  findAllOrders,
  filterOrderForLoggedUser,
  checkoutSession,
} = require("../../services/storeServices/OrderService");

const router = express.Router();


router.use(authServices.protect);
router.get(
  "/checkout-session/:cartId",
  authServices.allowedTo("user", "instructor"),
  checkoutSession
);

router
  .route("/")
  .get(
    authServices.allowedTo("user", "instructor", "admin"),
    filterOrderForLoggedUser,
    findAllOrders
  );
router.route("/:id").get(authServices.allowedTo("admin"), findSpecificOrder);
module.exports = router;
