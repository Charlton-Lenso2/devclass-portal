const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
} = require("../controllers/notification.controller");

router.use(authenticate);

router.get("/", getMyNotifications);
router.patch("/:id/read", markAsRead);
router.patch("/read-all", markAllAsRead);

module.exports = router;
