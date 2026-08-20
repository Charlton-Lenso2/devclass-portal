const prisma = require("../config/db");

// GET anyone authenticated can view
async function getActivities(req, res, next) {
  try {
    const activities = await prisma.activity.findMany({
      include: {
        category: true,
        createdBy: { select: { id: true, name: true, email: true } },
      },
      orderBy: { dueDate: "asc" },
    });
    res.json(activities);
  } catch (err) {
    next(err);
  }
}

// GET
async function getActivityById(req, res, next) {
  try {
    const { id } = req.params;
    const activity = await prisma.activity.findUnique({
      where: { id: Number(id) },
      include: {
        category: true,
        createdBy: { select: { id: true, name: true, email: true } },
      },
    });

    if (!activity) {
      return res.status(404).json({ error: "Activity not found" });
    }

    res.json(activity);
  } catch (err) {
    next(err);
  }
}

// POST 
async function createActivity(req, res, next) {
  try {
    const {
      title,
      description,
      type,
      priority,
      startDate,
      dueDate,
      location,
      categoryId,
    } = req.body;

    if (!title || !type) {
      return res.status(400).json({ error: "title and type are required" });
    }

    const activity = await prisma.activity.create({
      data: {
        title,
        description,
        type,
        priority: priority ?? 0,
        startDate: startDate ? new Date(startDate) : null,
        dueDate: dueDate ? new Date(dueDate) : null,
        location,
        categoryId: categoryId ? Number(categoryId) : null,
        createdById: req.user.id, 
      },
    });

    res.status(201).json(activity);
  } catch (err) {
    next(err);
  }
}

// PUT
async function updateActivity(req, res, next) {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      type,
      priority,
      status,
      startDate,
      dueDate,
      location,
      categoryId,
    } = req.body;

    const existing = await prisma.activity.findUnique({
      where: { id: Number(id) },
    });
    if (!existing) {
      return res.status(404).json({ error: "Activity not found" });
    }

    const activity = await prisma.activity.update({
      where: { id: Number(id) },
      data: {
        title,
        description,
        type,
        priority,
        status,
        startDate: startDate ? new Date(startDate) : undefined,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        location,
        categoryId: categoryId ? Number(categoryId) : undefined,
      },
    });

    res.json(activity);
  } catch (err) {
    next(err);
  }
}

// DELETE 
async function archiveActivity(req, res, next) {
  try {
    const { id } = req.params;

    const existing = await prisma.activity.findUnique({
      where: { id: Number(id) },
    });
    if (!existing) {
      return res.status(404).json({ error: "Activity not found" });
    }

    const activity = await prisma.activity.update({
      where: { id: Number(id) },
      data: { status: "ARCHIVED" },
    });

    res.json({ message: "Activity archived", activity });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getActivities,
  getActivityById,
  createActivity,
  updateActivity,
  archiveActivity,
};
