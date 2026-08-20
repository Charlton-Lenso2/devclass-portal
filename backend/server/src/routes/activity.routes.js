const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const {
  getActivities,
  getActivityById,
  createActivity,
  updateActivity,
  archiveActivity,
} = require("../controllers/activity.controller");

router.use(authenticate);

router.get("/", getActivities);
router.get("/:id", getActivityById);

router.post("/", authorize("ADMIN"), createActivity);
router.put("/:id", authorize("ADMIN"), updateActivity);
router.delete("/:id", authorize("ADMIN"), archiveActivity);

module.exports = router;
