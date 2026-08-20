const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const {
  getMe,
  updateMe,
  getAllUsers,
} = require("../controllers/user.controller");

router.use(authenticate);

router.get("/me", getMe);
router.put("/me", updateMe);
router.get("/", authorize("ADMIN"), getAllUsers);

module.exports = router;
