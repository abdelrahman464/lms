const express = require("express");
const authServices = require("../../services/authServices");
const { becomeMarketer,inviteOthers,calculateProfits } = require("../../services/marketing/marketingService");

const router = express.Router();
router.get('/inviteOthers',authServices.protect,inviteOthers)
router.get('/calculateProfits',calculateProfits)
router.put("/becomeMarketer", authServices.protect, becomeMarketer);
module.exports = router;
