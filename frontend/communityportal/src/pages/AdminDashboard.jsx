import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import {
  Users,
  ListChecks,
  Clock,
  AlertTriangle,
  CalendarDays,
  TrendingUp,
  ArrowRight,
  Sparkles,
} from "lucide-react";

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

  const cards = [
    {
      label: "Students",
      value: stats.totalStudents,
      icon: Users,
      tone: "blue",
    },
    {
      label: "Activities",
      value: stats.totalActivities,
      icon: ListChecks,
      tone: "indigo",
    },
    {
      label: "Due Soon",
      value: stats.dueSoonCount,
      icon: Clock,
      tone: "amber",
    },
    {
      label: "Expired",
      value: stats.expiredCount,
      icon: AlertTriangle,
      tone: "red",
    },
    {
      label: "Due This Week",
      value: stats.dueThisWeek,
      icon: CalendarDays,
      tone: "green",
    },
  ];

  return (
    <div className="page-container">
      <div className="dash-hero">
        <div>
          <p className="dash-eyebrow">
            <Sparkles size={14} /> Class overview
          </p>
          <h1 className="dash-hero-title">Admin Dashboard</h1>
          <p className="dash-hero-sub">
            {expiredActivities.length > 0
              ? `${expiredActivities.length} activity ${expiredActivities.length === 1 ? "needs" : "items need"} your review.`
              : "Everything's on track, nothing needs your attention right now."}
          </p>
        </div>
      </div>

      <div className="stats-grid">
        {cards.map(({ label, value, icon: Icon, tone }, i) => (
          <div
            key={label}
            className="stat-card fade-in"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className={`stat-icon stat-icon-${tone}`}>
              <Icon size={18} />
            </div>
            <p className="stat-number">{value}</p>
            <p className="stat-label">{label}</p>
          </div>
        ))}
      </div>

      {stats.mostCommonCategory && (
        <div className="dash-cta-card" style={{ marginBottom: 24 }}>
          <TrendingUp size={20} style={{ color: "var(--color-primary)" }} />
          <p style={{ margin: 0 }}>
            Most active category:{" "}
            <strong>{stats.mostCommonCategory.name}</strong>{" "}
            <span className="card-meta">
              ({stats.mostCommonCategory.activity_count} activities)
            </span>
          </p>
        </div>
      )}

      <section className="dashboard-section">
        <div className="section-header">
          <h2>
            <AlertTriangle
              size={17}
              style={{
                verticalAlign: -3,
                marginRight: 6,
                color: "var(--color-danger)",
              }}
            />
            Expired, Needs Review
          </h2>
          <Link to="/activities" className="section-link">
            View all <ArrowRight size={14} />
          </Link>
        </div>

        {expiredActivities.length === 0 ? (
          <div className="empty-state-card">
            <p>Nothing expired right now.</p>
          </div>
        ) : (
          <ul className="list-plain">
            {expiredActivities.map((a, i) => (
              <li
                key={a.id}
                className="card card-alert fade-in"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <div className="card-row">
                  <Link to={`/activities/${a.id}`}>{a.title}</Link>
                  <span className="card-meta">
                    Was due {new Date(a.dueDate).toLocaleDateString()}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
