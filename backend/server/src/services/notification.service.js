const prisma = require("../config/db");


async function createNotification({
  userId,
  activityId = null,
  type,
  message,
}) {
  try {
    return await prisma.notification.create({
      data: { userId, activityId, type, message },
    });
  } catch (err) {
    if (err.code === "P2002") {
      return null;
    }
    throw err;
  }
}

async function notifyAllStudents({ activityId, type, message }) {
  const students = await prisma.user.findMany({
    where: { role: "STUDENT" },
    select: { id: true },
  });

  const results = await Promise.all(
    students.map((student) =>
      createNotification({ userId: student.id, activityId, type, message }),
    ),
  );

  return results.filter(Boolean);
}


async function notifyAllAdmins({ activityId, type, message }) {
  const admins = await prisma.user.findMany({
    where: { role: "ADMIN" },
    select: { id: true },
  });

  const results = await Promise.all(
    admins.map((admin) =>
      createNotification({ userId: admin.id, activityId, type, message }),
    ),
  );

  return results.filter(Boolean);
}

module.exports = { createNotification, notifyAllStudents, notifyAllAdmins };
