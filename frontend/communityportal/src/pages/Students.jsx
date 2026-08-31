import { useEffect, useState } from "react";
import { getAllStudents } from "../api/users";
import { Users, Search, Mail, Calendar } from "lucide-react";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await getAllStudents();
        setStudents(res.data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.email.toLowerCase().includes(query.toLowerCase())
  );

  function readRateColor(rate) {
    if (rate === null) return "var(--color-text-muted)";
    if (rate >= 70) return "var(--color-success)";
    if (rate >= 40) return "var(--color-warning)";
    return "var(--color-danger)";
  }

  if (loading) return <p className="loading-state">Loading students...</p>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title-icon">
          <Users size={22} /> Students <span className="unread-count">{students.length}</span>
        </h1>
      </div>

      <div className="search-bar">
        <Search size={16} />
        <input
          placeholder="Search by name or email..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {filtered.length === 0 && (
        <div className="empty-state-card">
          <p>No students found.</p>
        </div>
      )}

      <div className="students-grid">
        {filtered.map((s, i) => (
          <div key={s.id} className="student-card fade-in" style={{ animationDelay: `${i * 30}ms` }}>
            <div className="student-card-top">
              {s.avatar ? (
                <img src={s.avatar} alt={s.name} className="student-avatar-img" />
              ) : (
                <div className="student-avatar">{s.name?.[0]?.toUpperCase()}</div>
              )}
              <div className="student-info">
                <p className="student-name">{s.name}</p>
                <p className="student-email">
                  <Mail size={12} /> {s.email}
                </p>
              </div>
            </div>

            <div className="student-card-stats">
              <div className="student-stat">
                <span className="student-stat-label">Notification read rate</span>
                <span className="student-stat-value" style={{ color: readRateColor(s.readRate) }}>
                  {s.readRate === null ? "No data" : `${s.readRate}%`}
                </span>
              </div>
              {s.readRate !== null && (
                <div className="read-progress-track" style={{ width: "100%" }}>
                  <div
                    className="read-progress-fill"
                    style={{
                      width: `${s.readRate}%`,
                      background: readRateColor(s.readRate),
                    }}
                  />
                </div>
              )}
              <p className="student-stat-sub">
                {s.readNotifications} of {s.totalNotifications} notifications read
              </p>
            </div>

            <p className="student-joined">
              <Calendar size={12} /> Joined {new Date(s.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}