const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  getActivityReadStatus,
} = require("../controllers/notification.controller");

router.use(authenticate);

router.get("/", getMyNotifications);
router.patch("/:id/read", markAsRead);
router.patch("/read-all", markAllAsRead);
router.get("/activity/:activityId/status", authorize("ADMIN"), getActivityReadStatus);

module.exports = router;
