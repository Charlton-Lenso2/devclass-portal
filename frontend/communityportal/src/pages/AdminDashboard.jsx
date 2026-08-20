import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [expiredActivities, setExpiredActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [overviewRes, activitiesRes] = await Promise.all([
        api.get("/analytics/overview"),
        api.get("/activities"),
      ]);
      setStats(overviewRes.data);
      setExpiredActivities(
        activitiesRes.data.filter((a) => a.status === "EXPIRED"),
      );
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <p className="loading-state">Loading dashboard...</p>;

  return (
    <div className="page-container">
      <h1>Admin Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <p className="stat-number">{stats.totalStudents}</p>
          <p className="stat-label">Students</p>
        </div>
        <div className="stat-card">
          <p className="stat-number">{stats.totalActivities}</p>
          <p className="stat-label">Activities</p>
        </div>
        <div className="stat-card">
          <p className="stat-number" style={{ color: "var(--color-warning)" }}>
            {stats.dueSoonCount}
          </p>
          <p className="stat-label">Due Soon</p>
        </div>
        <div className="stat-card">
          <p className="stat-number" style={{ color: "var(--color-danger)" }}>
            {stats.expiredCount}
          </p>
          <p className="stat-label">Expired</p>
        </div>
        <div className="stat-card">
          <p className="stat-number">{stats.dueThisWeek}</p>
          <p className="stat-label">Due This Week</p>
        </div>
      </div>

      {stats.mostCommonCategory && (
        <p>
          Most active category: <strong>{stats.mostCommonCategory.name}</strong>{" "}
          ({stats.mostCommonCategory.activity_count} activities)
        </p>
      )}

      <section className="dashboard-section">
        <h2>Expired, Needs Review</h2>
        {expiredActivities.length === 0 && (
          <p className="empty-state">Nothing expired right now.</p>
        )}
        <ul className="list-plain">
          {expiredActivities.map((a) => (
            <li key={a.id} className="card card-alert">
              <div className="card-row">
                <Link to={`/activities/${a.id}`}>{a.title}</Link>
                <span className="card-meta">
                  Was due {new Date(a.dueDate).toLocaleDateString()}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
