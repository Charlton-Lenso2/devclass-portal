import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getActivities } from "../api/activities";
import { getNotifications } from "../api/notifications";
import { getAnnouncements } from "../api/announcements";
import { getStatusColor } from "../utils/statusBadge";

export default function Dashboard() {
  const { user } = useAuth();
  const [dueSoon, setDueSoon] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [recentAnnouncements, setRecentAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [activitiesRes, notificationsRes, announcementsRes] =
        await Promise.all([
          getActivities(),
          getNotifications(),
          getAnnouncements(),
        ]);

      const urgent = activitiesRes.data
        .filter((a) => a.status === "DUE_SOON" || a.status === "EXPIRED")
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

      setDueSoon(urgent);
      setUnreadCount(notificationsRes.data.filter((n) => !n.isRead).length);
      setRecentAnnouncements(announcementsRes.data.slice(0, 3));
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <p className="loading-state">Loading dashboard...</p>;

  return (
    <div className="page-container">
      <h1>Welcome, {user?.name}</h1>

      <section className="dashboard-section">
        <h2>Due Soon & Expired</h2>
        {dueSoon.length === 0 && (
          <p className="empty-state">Nothing urgent, you're all caught up.</p>
        )}
        <ul className="list-plain">
          {dueSoon.map((a) => (
            <li key={a.id} className="card">
              <Link to={`/activities/${a.id}`} className="card-link">
                <div className="card-row">
                  <strong>{a.title}</strong>
                  <span
                    className="badge"
                    style={{ background: getStatusColor(a.status) }}
                  >
                    {a.status}
                  </span>
                </div>
                <p className="card-meta">
                  Due: {new Date(a.dueDate).toLocaleString()}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="dashboard-section">
        <h2>
          Notifications{" "}
          {unreadCount > 0 && (
            <span style={{ color: "var(--color-danger)" }}>
              ({unreadCount} unread)
            </span>
          )}
        </h2>
        <Link to="/notifications">View all notifications →</Link>
      </section>

      <section className="dashboard-section">
        <h2>Recent Announcements</h2>
        {recentAnnouncements.length === 0 && (
          <p className="empty-state">No announcements yet.</p>
        )}
        {recentAnnouncements.map((a) => (
          <div key={a.id} style={{ marginBottom: 10 }}>
            <strong>{a.title}</strong>
            <p className="card-subtitle">{a.content}</p>
          </div>
        ))}
        <Link to="/announcements">View all announcements →</Link>
      </section>
    </div>
  );
}
