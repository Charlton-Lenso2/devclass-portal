const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");

const { processDeadlines } = require("../services/deadline.service");

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

router.post(
  "/process-deadlines",
  authorize("ADMIN"),
  async (req, res, next) => {
    try {
      const result = await processDeadlines();
      res.json(result);
    } catch (err) {
      next(err);
    }
  },
);

module.exports = router;
