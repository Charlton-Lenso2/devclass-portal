const prisma = require("../config/db");

// GET /api/notifications — the logged-in user's own notifications only
async function getMyNotifications(req, res, next) {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user.id },
      include: {
        activity: {
          select: { id: true, title: true, type: true, dueDate: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(notifications);
  } catch (err) {
    next(err);
  }
}

// PATCH /api/notifications/:id/read — mark a single notification as read
async function markAsRead(req, res, next) {
  try {
    const { id } = req.params;

    const notification = await prisma.notification.findUnique({
      where: { id: Number(id) },
    });
    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    // ownership check — a user can only mark THEIR OWN notifications as read
    if (notification.userId !== req.user.id) {
      return res
        .status(403)
        .json({ error: "You cannot modify another user's notification" });
    }

    const updated = await prisma.notification.update({
      where: { id: Number(id) },
      data: { isRead: true },
    });

    res.json(updated);
  } catch (err) {
    next(err);
  }
}

// PATCH /api/notifications/read-all — mark all of the logged-in user's notifications as read
async function markAllAsRead(req, res, next) {
  try {
    await prisma.notification.updateMany({
      where: { userId: req.user.id, isRead: false },
      data: { isRead: true },
    });
    res.json({ message: "All notifications marked as read" });
  } catch (err) {
    next(err);
  }
}

module.exports = { getMyNotifications, markAsRead, markAllAsRead };
