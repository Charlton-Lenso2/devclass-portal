const prisma = require("../config/db");

// GET /api/categories — anyone authenticated can view
async function getCategories(req, res, next) {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });
    res.json(categories);
  } catch (err) {
    next(err);
  }
}

// POST /api/categories — admin only
async function createCategory(req, res, next) {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "name is required" });
    }

    const existing = await prisma.category.findUnique({ where: { name } });
    if (existing) {
      return res.status(409).json({ error: "Category already exists" });
    }

    const category = await prisma.category.create({ data: { name } });
    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
}

// PUT /api/categories/:id — admin only
async function updateCategory(req, res, next) {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const existing = await prisma.category.findUnique({
      where: { id: Number(id) },
    });
    if (!existing) {
      return res.status(404).json({ error: "Category not found" });
    }

    const category = await prisma.category.update({
      where: { id: Number(id) },
      data: { name },
    });

    res.json(category);
  } catch (err) {
    next(err);
  }
}

// DELETE /api/categories/:id — admin only
async function deleteCategory(req, res, next) {
  try {
    const { id } = req.params;

    const existing = await prisma.category.findUnique({
      where: { id: Number(id) },
    });
    if (!existing) {
      return res.status(404).json({ error: "Category not found" });
    }

    // check if any activities still use this category first
    const inUse = await prisma.activity.findFirst({
      where: { categoryId: Number(id) },
    });
    if (inUse) {
      return res
        .status(409)
        .json({ error: "Cannot delete category still in use by activities" });
    }

    await prisma.category.delete({ where: { id: Number(id) } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
