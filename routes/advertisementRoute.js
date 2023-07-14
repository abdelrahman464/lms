const express = require("express");
const {
  createAdvertisement,
  getAdvertisement,
  getAllAdvertisements,
  updateAdvertisement,
  deleteAdvertisement,
  uploadAdvertisementImage,
  resizeImage,
} = require("../services/advertisementService");

const router = express.Router();

router
  .route("/")
  .get(getAllAdvertisements)
  .post(uploadAdvertisementImage, resizeImage, createAdvertisement);
router
  .route("/:id")
  .get(getAdvertisement)
  .put(uploadAdvertisementImage, resizeImage, updateAdvertisement)
  .delete(deleteAdvertisement);

module.exports = router;
