import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
} from "../api/notifications";
import { Bell, BellRing, CheckCheck, Check } from "lucide-react";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const res = await getNotifications();
      setNotifications(res.data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleMarkRead(id) {
    await markAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
  }

  async function handleMarkAllRead() {
    await markAllAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }

  if (loading) return <p className="loading-state">Loading...</p>;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title-icon">
          {unreadCount > 0 ? (
            <BellRing size={24} className="icon-ring" />
          ) : (
            <Bell size={24} />
          )}
          Notifications{" "}
          {unreadCount > 0 && (
            <span className="unread-count">{unreadCount}</span>
          )}
        </h1>
        {unreadCount > 0 && (
          <button onClick={handleMarkAllRead} className="btn-secondary">
            <CheckCheck size={16} />
            Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 && (
        <div className="empty-state">
          <Bell size={32} style={{ opacity: 0.3, marginBottom: 8 }} />
          <p>No notifications yet.</p>
        </div>
      )}

      <ul className="list-plain">
        {notifications.map((n, i) => (
          <li
            key={n.id}
            className={`card notification-card ${!n.isRead ? "card-unread" : ""}`}
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <p style={{ margin: 0 }}>{n.message}</p>
            <div className="card-row" style={{ marginTop: 8 }}>
              <div>
                {n.activity && (
                  <Link
                    to={`/activities/${n.activity.id}`}
                    style={{ fontSize: 13 }}
                  >
                    View activity →
                  </Link>
                )}
                <span
                  className="card-meta"
                  style={{ display: "inline", marginLeft: 10 }}
                >
                  {new Date(n.createdAt).toLocaleString()}
                </span>
              </div>
              {!n.isRead && (
                <button
                  onClick={() => handleMarkRead(n.id)}
                  className="btn-secondary"
                  style={{ fontSize: 12, padding: "4px 10px" }}
                >
                  <Check size={14} />
                  Mark read
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
