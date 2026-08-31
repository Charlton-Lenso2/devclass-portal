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

    const notification = await prisma.notification.findUnique({ where: { id: Number(id) } });
    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    if (notification.userId !== req.user.id) {
      return res.status(403).json({ error: "You cannot modify another user's notification" });
    }

    const updated = await prisma.notification.update({
      where: { id: Number(id) },
      data: { isRead: true, readAt: new Date() },
    });

    res.json(updated);
  } catch (err) {
    next(err);
  }
}

async function markAllAsRead(req, res, next) {
  try {
    await prisma.notification.updateMany({
      where: { userId: req.user.id, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });
    res.json({ message: "All notifications marked as read" });
  } catch (err) {
    next(err);
  }
}

async function getActivityReadStatus(req, res, next) {
  try {
    const { activityId } = req.params;

    const activity = await prisma.activity.findUnique({
      where: { id: Number(activityId) },
      select: { id: true, title: true },
    });

    if (!activity) {
      return res.status(404).json({ error: "Activity not found" });
    }

    const notifications = await prisma.notification.findMany({
      where: { activityId: Number(activityId) },
      include: { user: { select: { id: true, name: true, email: true, role: true } } },
      orderBy: { createdAt: "asc" },
    });

    const students = notifications.filter((n) => n.user.role === "STUDENT");
    const read = students.filter((n) => n.isRead);
    const unread = students.filter((n) => !n.isRead);

    res.json({
      activity,
      totalNotified: students.length,
      readCount: read.length,
      unreadCount: unread.length,
      read: read.map((n) => ({ id: n.user.id, name: n.user.name, email: n.user.email, readAt: n.readAt })),
      unread: unread.map((n) => ({ id: n.user.id, name: n.user.name, email: n.user.email })),
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  getActivityReadStatus,
};
