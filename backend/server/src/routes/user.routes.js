const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const {
  getMe,
  updateMe,
  getAllUsers,
  completeOnboarding,
} = require("../controllers/user.controller");

router.use(authenticate);

router.get("/me", getMe);
router.put("/me", updateMe);
router.patch("/me/onboarded", completeOnboarding);
router.get("/", authorize("ADMIN"), getAllUsers);

module.exports = router;