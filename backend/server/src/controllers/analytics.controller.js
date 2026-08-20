const prisma = require("../config/db");

// GET /api/analytics/overview
async function getOverview(req, res, next) {
  try {
    const [
      totalStudents,
      totalActivities,
      dueSoonCount,
      expiredCount,
      dueThisWeek,
      mostCommonCategory,
    ] = await Promise.all([
      // total students
      prisma.$queryRaw`SELECT COUNT(*)::int AS count FROM users WHERE role = 'STUDENT'`,

      // total activities (excluding archived)
      prisma.$queryRaw`SELECT COUNT(*)::int AS count FROM activity WHERE status != 'ARCHIVED'`,

      // due-soon count
      prisma.$queryRaw`SELECT COUNT(*)::int AS count FROM activity WHERE status = 'DUE_SOON'`,

      // expired count
      prisma.$queryRaw`SELECT COUNT(*)::int AS count FROM activity WHERE status = 'EXPIRED'`,

      // activities due within the next 7 days
      prisma.$queryRaw`
        SELECT COUNT(*)::int AS count
        FROM activity
        WHERE due_date BETWEEN NOW() AND NOW() + INTERVAL '7 days'
      `,

      // most common category
      prisma.$queryRaw`
        SELECT c.name, COUNT(a.id)::int AS activity_count
        FROM category c
        JOIN activity a ON a.category_id = c.id
        GROUP BY c.name
        ORDER BY activity_count DESC
        LIMIT 1
      `,
    ]);

    res.json({
      totalStudents: totalStudents[0].count,
      totalActivities: totalActivities[0].count,
      dueSoonCount: dueSoonCount[0].count,
      expiredCount: expiredCount[0].count,
      dueThisWeek: dueThisWeek[0].count,
      mostCommonCategory: mostCommonCategory[0] || null,
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/analytics/notifications 
async function getNotificationStats(req, res, next) {
  try {
    const byType = await prisma.$queryRaw`
      SELECT type, COUNT(*)::int AS count
      FROM notification
      GROUP BY type
      ORDER BY count DESC
    `;

    const readRate = await prisma.$queryRaw`
      SELECT
        ROUND(AVG(CASE WHEN is_read THEN 1 ELSE 0 END) * 100, 1)::float AS read_percentage
      FROM notification
    `;

    res.json({
      byType,
      readPercentage: readRate[0].read_percentage || 0,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getOverview, getNotificationStats };
