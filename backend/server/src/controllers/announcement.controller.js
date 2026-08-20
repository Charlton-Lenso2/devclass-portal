const prisma = require("../config/db");

// GET /api/announcements — anyone authenticated can view
async function getAnnouncements(req, res, next) {
  try {
    const announcements = await prisma.announcement.findMany({
      include: { createdBy: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.json(announcements);
  } catch (err) {
    next(err);
  }
}

// GET /api/announcements/:id
async function getAnnouncementById(req, res, next) {
  try {
    const { id } = req.params;
    const announcement = await prisma.announcement.findUnique({
      where: { id: Number(id) },
      include: { createdBy: { select: { id: true, name: true } } },
    });

    if (!announcement) {
      return res.status(404).json({ error: "Announcement not found" });
    }

    res.json(announcement);
  } catch (err) {
    next(err);
  }
}

// POST /api/announcements — admin only
async function createAnnouncement(req, res, next) {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: "title and content are required" });
    }

    const announcement = await prisma.announcement.create({
      data: { title, content, createdById: req.user.id },
    });

    res.status(201).json(announcement);
  } catch (err) {
    next(err);
  }
}

// PUT /api/announcements/:id — admin only
async function updateAnnouncement(req, res, next) {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const existing = await prisma.announcement.findUnique({
      where: { id: Number(id) },
    });
    if (!existing) {
      return res.status(404).json({ error: "Announcement not found" });
    }

    const announcement = await prisma.announcement.update({
      where: { id: Number(id) },
      data: { title, content },
    });

    res.json(announcement);
  } catch (err) {
    next(err);
  }
}

// DELETE /api/announcements/:id — admin only, true delete
async function deleteAnnouncement(req, res, next) {
  try {
    const { id } = req.params;

    const existing = await prisma.announcement.findUnique({
      where: { id: Number(id) },
    });
    if (!existing) {
      return res.status(404).json({ error: "Announcement not found" });
    }

    await prisma.announcement.delete({ where: { id: Number(id) } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
};
