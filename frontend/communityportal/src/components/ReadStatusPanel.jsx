import { useEffect, useState } from "react";
import { getActivityReadStatus } from "../api/notifications";
import { Eye, EyeOff, Users, ChevronDown, ChevronUp } from "lucide-react";

export default function ReadStatusPanel({ activityId }) {
  const [data, setData] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await getActivityReadStatus(activityId);
        setData(res.data);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load read status");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [activityId]);

  if (loading) return <p className="loading-state">Loading read status...</p>;
  if (error) return <p className="form-error">{error}</p>;
  if (!data || data.totalNotified === 0) return null;

  const percent = Math.round((data.readCount / data.totalNotified) * 100);

  return (
    <div className="read-panel">
      <button className="read-panel-header" onClick={() => setOpen(!open)}>
        <div className="read-panel-title">
          <Users size={16} />
          <span>Seen by {data.readCount} of {data.totalNotified} students</span>
        </div>
        <div className="read-panel-right">
          <div className="read-progress-track">
            <div className="read-progress-fill" style={{ width: `${percent}%` }} />
          </div>
          <span className="read-percent">{percent}%</span>
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      {open && (
        <div className="read-panel-body">
          {data.read.length > 0 && (
            <div className="read-group">
              <p className="read-group-label">
                <Eye size={13} /> Read ({data.read.length})
              </p>
              <ul className="read-name-list">
                {data.read.map((s) => (
                  <li key={s.id}>
                    <span>{s.name}</span>
                    {s.readAt && (
                      <span className="card-meta">{new Date(s.readAt).toLocaleString()}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {data.unread.length > 0 && (
            <div className="read-group">
              <p className="read-group-label read-group-label-muted">
                <EyeOff size={13} /> Not read yet ({data.unread.length})
              </p>
              <ul className="read-name-list">
                {data.unread.map((s) => (
                  <li key={s.id}>
                    <span>{s.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}