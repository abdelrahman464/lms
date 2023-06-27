const express = require("express");

const {
  createSubscription,
  updateSubscription,
  getAllSubscriptions,
  getSubscriptionById,
  deleteSubscription,
} = require("../../services/educationServices/subscriptionServices");

const router = express.Router();

router.route("/").get(getAllSubscriptions).post(createSubscription);

router
  .route("/:id")
  .get(getSubscriptionById)
  .put(updateSubscription)
  .delete(deleteSubscription);

module.exports = router;

// Update a subscription by ID
