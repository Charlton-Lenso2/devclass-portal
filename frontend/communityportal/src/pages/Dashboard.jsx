import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getActivities } from "../api/activities";
import { getNotifications } from "../api/notifications";
import { getAnnouncements } from "../api/announcements";
import { getStatusColor } from "../utils/statusBadge";
import {
  Clock,
  Megaphone,
  Bell,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from "lucide-react";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function Dashboard() {
  const { user } = useAuth();
  const [dueSoon, setDueSoon] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [recentAnnouncements, setRecentAnnouncements] = useState([]);
  const [totalActive, setTotalActive] = useState(0);
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
      setTotalActive(
        activitiesRes.data.filter((a) => a.status !== "ARCHIVED").length,
      );
      setUnreadCount(notificationsRes.data.filter((n) => !n.isRead).length);
      setRecentAnnouncements(announcementsRes.data.slice(0, 3));
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <p className="loading-state">Loading dashboard...</p>;

  const firstName = user?.name?.split(" ")[0];

  return (
    <div className="page-container">
      <div className="dash-hero">
        <div>
          <p className="dash-eyebrow">
            <Sparkles size={14} /> {getGreeting()}
          </p>
          <h1 className="dash-hero-title">Hey, {firstName}</h1>
          <p className="dash-hero-sub">
            {dueSoon.length > 0
              ? `You have ${dueSoon.length} ${dueSoon.length === 1 ? "item" : "items"} that need attention.`
              : "You're all caught up — nothing urgent right now."}
          </p>
        </div>
      </div>

      <div className="dash-stats-row">
        <div className="dash-mini-stat">
          <div className="dash-mini-icon dash-mini-icon-blue">
            <CheckCircle2 size={18} />
          </div>
          <div>
            <p className="dash-mini-number">{totalActive}</p>
            <p className="dash-mini-label">Active items</p>
          </div>
        </div>
        <div className="dash-mini-stat">
          <div className="dash-mini-icon dash-mini-icon-amber">
            <Clock size={18} />
          </div>
          <div>
            <p className="dash-mini-number">{dueSoon.length}</p>
            <p className="dash-mini-label">Due soon</p>
          </div>
        </div>
        <div className="dash-mini-stat">
          <div className="dash-mini-icon dash-mini-icon-red">
            <Bell size={18} />
          </div>
          <div>
            <p className="dash-mini-number">{unreadCount}</p>
            <p className="dash-mini-label">Unread</p>
          </div>
        </div>
      </div>

      <section className="dashboard-section">
        <div className="section-header">
          <h2>Due Soon &amp; Expired</h2>
          <Link to="/activities" className="section-link">
            View all <ArrowRight size={14} />
          </Link>
        </div>

        {dueSoon.length === 0 ? (
          <div className="empty-state-card">
            <CheckCircle2 size={28} style={{ opacity: 0.35 }} />
            <p>Nothing urgent — you're all caught up.</p>
          </div>
        ) : (
          <ul className="list-plain">
            {dueSoon.map((a, i) => (
              <li
                key={a.id}
                className="card fade-in"
                style={{ animationDelay: `${i * 40}ms` }}
              >
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
                    <Clock
                      size={12}
                      style={{ verticalAlign: -1, marginRight: 4 }}
                    />
                    Due {new Date(a.dueDate).toLocaleString()}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="dash-two-col">
        <section className="dashboard-section">
          <div className="section-header">
            <h2>
              <Bell size={17} style={{ verticalAlign: -3, marginRight: 6 }} />
              Notifications
            </h2>
            <Link to="/notifications" className="section-link">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          {unreadCount === 0 ? (
            <div className="empty-state-card">
              <p>No new notifications.</p>
            </div>
          ) : (
            <div className="dash-cta-card">
              <p>
                You have <strong>{unreadCount}</strong> unread{" "}
                {unreadCount === 1 ? "notification" : "notifications"}.
              </p>
              <Link
                to="/notifications"
                className="btn-primary"
                style={{ display: "inline-flex" }}
              >
                Review now
              </Link>
            </div>
          )}
        </section>

        <section className="dashboard-section">
          <div className="section-header">
            <h2>
              <Megaphone
                size={17}
                style={{ verticalAlign: -3, marginRight: 6 }}
              />
              Announcements
            </h2>
            <Link to="/announcements" className="section-link">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          {recentAnnouncements.length === 0 ? (
            <div className="empty-state-card">
              <p>No announcements yet.</p>
            </div>
          ) : (
            recentAnnouncements.map((a) => (
              <div key={a.id} className="mini-announcement">
                <strong>{a.title}</strong>
                <p className="card-subtitle">{a.content}</p>
              </div>
            ))
          )}
        </section>
      </div>
    </div>
  );
}
