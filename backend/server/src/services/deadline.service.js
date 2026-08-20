const prisma = require("../config/db");
const {
  notifyAllStudents,
  notifyAllAdmins,
} = require("./notification.service");

const DAY_MS = 24 * 60 * 60 * 1000;

function calculateStatus(dueDate, now = new Date()) {
  if (!dueDate) return "ACTIVE";

  const due = new Date(dueDate);
  const msRemaining = due.getTime() - now.getTime();

  if (msRemaining <= 0) return "EXPIRED";
  if (msRemaining <= 3 * DAY_MS) return "DUE_SOON";
  return "ACTIVE";
}

function isUrgent(dueDate, now = new Date()) {
  if (!dueDate) return false;
  const msRemaining = new Date(dueDate).getTime() - now.getTime();
  return msRemaining > 0 && msRemaining <= DAY_MS;
}

async function processDeadlines() {
  const activities = await prisma.activity.findMany({
    where: { status: { not: "ARCHIVED" } },
  });

  const now = new Date();
  let updatedCount = 0;

  for (const activity of activities) {
    const newStatus = calculateStatus(activity.dueDate, now);

    if (newStatus !== activity.status) {
      await prisma.activity.update({
        where: { id: activity.id },
        data: { status: newStatus },
      });
      updatedCount++;

      if (newStatus === "DUE_SOON") {
        const urgent = isUrgent(activity.dueDate, now);
        await notifyAllStudents({
          activityId: activity.id,
          type: urgent ? "DUE_TOMORROW" : "DUE_SOON",
          message: urgent
            ? `"${activity.title}" is due within 24 hours.`
            : `"${activity.title}" is due soon (within 3 days).`,
        });
      }

      if (newStatus === "EXPIRED") {
        await notifyAllAdmins({
          activityId: activity.id,
          type: "ADMIN_REVIEW_NEEDED",
          message: `"${activity.title}" has expired and needs review.`,
        });
      }
    }
  }

  console.log(
    `[deadline check] ran at ${now.toISOString()} — ${updatedCount} activities updated`,
  );
  return { checked: activities.length, updated: updatedCount };
}

module.exports = { calculateStatus, isUrgent, processDeadlines };
