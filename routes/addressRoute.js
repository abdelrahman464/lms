const express = require("express");
const { addAddressValidator } = require("../utils/validators/addressValidator");
const {
  addAddress,
  removeAddressFromAddressList,
  getLoggedUseraddresses,
} = require("../services/addressService");
const authServices = require("../services/authServices");

const router = express.Router();

router.use(authServices.protect, authServices.allowedTo("user"));

router
  .route("/")
  .get(getLoggedUseraddresses)
  .post(addAddressValidator, addAddress);
router.delete("/:addressId", removeAddressFromAddressList);

module.exports = router;
