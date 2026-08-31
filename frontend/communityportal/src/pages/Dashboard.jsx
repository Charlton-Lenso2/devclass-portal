import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getActivities } from "../api/activities";
import { getNotifications } from "../api/notifications";
import { getAnnouncements } from "../api/announcements";
import {
  Clock,
  Megaphone,
  Bell,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function timeUntil(date) {
  const diffMins = Math.round((new Date(date) - new Date()) / 60000);
  if (diffMins < 0) {
    const overdue = Math.abs(diffMins);
    if (overdue < 60) return `overdue ${overdue}m ago`;
    const hrs = Math.round(overdue / 60);
    if (hrs < 24) return `overdue ${hrs}h ago`;
    return `overdue ${Math.round(hrs / 24)}d ago`;
  }
  if (diffMins < 60) return `due in ${diffMins}m`;
  const hrs = Math.round(diffMins / 60);
  if (hrs < 24) return `due in ${hrs}h`;
  return `due in ${Math.round(hrs / 24)}d`;
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
              : "You're all caught up, nothing urgent right now."}
          </p>
        </div>
      </div>

      <div className="dash-stats-row">
        <div
          className="dash-mini-stat dash-stat-modern fade-in"
          style={{ animationDelay: "0ms" }}
        >
          <div className="dash-stat-top">
            <div className="dash-mini-icon dash-mini-icon-blue">
              <CheckCircle2 size={18} />
            </div>
            <TrendingUp size={15} className="dash-trend-icon dash-trend-green" />
          </div>
          <p className="dash-mini-number">{totalActive}</p>
          <p className="dash-mini-label">Active items</p>
          <p className="dash-stat-delta">
            {dueSoon.length > 0
              ? `${dueSoon.length} ${dueSoon.length === 1 ? "needs" : "need"} attention`
              : "All on track"}
          </p>
        </div>

        <div
          className="dash-mini-stat dash-stat-modern fade-in"
          style={{ animationDelay: "50ms" }}
        >
          <div className="dash-stat-top">
            <div className="dash-mini-icon dash-mini-icon-amber">
              <Clock size={18} />
            </div>
            <TrendingUp size={15} className="dash-trend-icon dash-trend-amber" />
          </div>
          <p className="dash-mini-number">{dueSoon.length}</p>
          <p className="dash-mini-label">Due soon</p>
          <p className="dash-stat-delta">
            {dueSoon.length > 0
              ? `Soonest ${timeUntil(dueSoon[0].dueDate)}`
              : "No upcoming deadlines"}
          </p>
        </div>

        <div
          className="dash-mini-stat dash-stat-modern fade-in"
          style={{ animationDelay: "100ms" }}
        >
          <div className="dash-stat-top">
            <div className="dash-mini-icon dash-mini-icon-red">
              <Bell size={18} />
            </div>
            <TrendingUp size={15} className="dash-trend-icon dash-trend-red" />
          </div>
          <p className="dash-mini-number">{unreadCount}</p>
          <p className="dash-mini-label">Unread</p>
          <p className="dash-stat-delta">
            {unreadCount > 0 ? "Waiting in notifications" : "All caught up"}
          </p>
        </div>
      </div>

      {totalActive > 0 && (
        <div className="dash-progress-card fade-in">
          <div className="dash-progress-head">
            <p>Attention needed</p>
            <span>
              {Math.min(
                100,
                Math.round((dueSoon.length / totalActive) * 100),
              )}
              %
            </span>
          </div>
          <div className="progress-track">
            <div
              className="progress-fill progress-fill-amber"
              style={{
                width: `${Math.min(100, Math.round((dueSoon.length / totalActive) * 100))}%`,
              }}
            />
          </div>
          <p className="dash-progress-sub">
            {dueSoon.length} of {totalActive} active items are due soon or
            expired.
          </p>
        </div>
      )}

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
            <p>Nothing urgent, you're all caught up.</p>
          </div>
        ) : (
          <ul className="list-plain">
            {dueSoon.map((a, i) => (
              <li
                key={a.id}
                className="fade-in"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <Link
                  to={`/activities/${a.id}`}
                  className="card-link activity-row"
                >
                  <div
                    className={`activity-icon ${a.status === "EXPIRED" ? "activity-icon-red" : "activity-icon-amber"}`}
                  >
                    {a.status === "EXPIRED" ? (
                      <AlertTriangle size={16} />
                    ) : (
                      <Clock size={16} />
                    )}
                  </div>
                  <div className="activity-main">
                    <p className="activity-title">{a.title}</p>
                    <p className="card-meta">
                      {a.status.replace("_", " ").toLowerCase()}
                    </p>
                  </div>
                  <span className="activity-time">{timeUntil(a.dueDate)}</span>
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
