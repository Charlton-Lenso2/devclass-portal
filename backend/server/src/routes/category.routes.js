const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/category.controller");

router.use(authenticate);

router.get("/", getCategories);

router.post("/", authorize("ADMIN"), createCategory);
router.put("/:id", authorize("ADMIN"), updateCategory);
router.delete("/:id", authorize("ADMIN"), deleteCategory);

module.exports = router;
