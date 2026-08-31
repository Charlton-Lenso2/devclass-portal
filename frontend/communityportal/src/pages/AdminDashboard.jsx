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

  const expiredPct = stats.totalActivities
    ? Math.round((stats.expiredCount / stats.totalActivities) * 100)
    : 0;

  const cards = [
    {
      label: "Students",
      value: stats.totalStudents,
      icon: Users,
      tone: "blue",
      trend: "green",
      hint: "Registered in your class",
    },
    {
      label: "Activities",
      value: stats.totalActivities,
      icon: ListChecks,
      tone: "indigo",
      trend: "green",
      hint: `${stats.dueThisWeek} due this week`,
    },
    {
      label: "Due Soon",
      value: stats.dueSoonCount,
      icon: Clock,
      tone: "amber",
      trend: "amber",
      hint: "Needs attention soon",
    },
    {
      label: "Expired",
      value: stats.expiredCount,
      icon: AlertTriangle,
      tone: "red",
      trend: "red",
      hint: `${expiredPct}% of all activities`,
    },
    {
      label: "Due This Week",
      value: stats.dueThisWeek,
      icon: CalendarDays,
      tone: "green",
      trend: "green",
      hint: "Upcoming deadlines",
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
        {cards.map(({ label, value, icon: Icon, tone, trend, hint }, i) => (
          <div
            key={label}
            className="stat-card stat-card-modern fade-in"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className="dash-stat-top">
              <div className={`stat-icon stat-icon-${tone}`}>
                <Icon size={18} />
              </div>
              <TrendingUp
                size={15}
                className={`dash-trend-icon dash-trend-${trend}`}
              />
            </div>
            <p className="stat-number">{value}</p>
            <p className="stat-label">{label}</p>
            <p className="dash-stat-delta">{hint}</p>
          </div>
        ))}
      </div>

      {stats.mostCommonCategory && (
        <div className="dash-progress-card fade-in">
          <div className="dash-progress-head">
            <p>
              Most active category:{" "}
              <strong>{stats.mostCommonCategory.name}</strong>
            </p>
            <span>
              {stats.totalActivities
                ? Math.min(
                    100,
                    Math.round(
                      (stats.mostCommonCategory.activity_count /
                        stats.totalActivities) *
                        100,
                    ),
                  )
                : 0}
              %
            </span>
          </div>
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{
                width: `${
                  stats.totalActivities
                    ? Math.min(
                        100,
                        Math.round(
                          (stats.mostCommonCategory.activity_count /
                            stats.totalActivities) *
                            100,
                        ),
                      )
                    : 0
                }%`,
              }}
            />
          </div>
          <p className="dash-progress-sub">
            {stats.mostCommonCategory.activity_count} of {stats.totalActivities}{" "}
            activities belong to this category.
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
                className="fade-in"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <Link
                  to={`/activities/${a.id}`}
                  className="card-link activity-row"
                >
                  <div className="activity-icon activity-icon-red">
                    <AlertTriangle size={16} />
                  </div>
                  <div className="activity-main">
                    <p className="activity-title">{a.title}</p>
                    <p className="card-meta">Expired</p>
                  </div>
                  <span className="activity-time">
                    Was due {new Date(a.dueDate).toLocaleDateString()}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
