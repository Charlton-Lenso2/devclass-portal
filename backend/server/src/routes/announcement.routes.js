const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const {
  getAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} = require("../controllers/announcement.controller");

router.use(authenticate);

router.get("/", getAnnouncements);
router.get("/:id", getAnnouncementById);

router.post("/", authorize("ADMIN"), createAnnouncement);
router.put("/:id", authorize("ADMIN"), updateAnnouncement);
router.delete("/:id", authorize("ADMIN"), deleteAnnouncement);

module.exports = router;
