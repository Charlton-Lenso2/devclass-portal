const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const {
  getOverview,
  getNotificationStats,
} = require("../controllers/analytics.controller");

router.use(authenticate, authorize("ADMIN"));

router.get("/overview", getOverview);
router.get("/notifications", getNotificationStats);

module.exports = router;
