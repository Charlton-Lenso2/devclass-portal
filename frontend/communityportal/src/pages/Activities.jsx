import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getActivities } from "../api/activities";
import { getStatusColor } from "../utils/statusBadge";
import { useAuth } from "../context/AuthContext";

export default function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    async function load() {
      try {
        const res = await getActivities();
        setActivities(res.data);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load activities");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <p>Loading activities...</p>;
  if (error) return <p className="form-error">{error}</p>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Activities</h1>
        {user?.role === "ADMIN" && (
          <Link to="/activities/new">
            <button className="btn-primary">+ New Activity</button>
          </Link>
        )}
      </div>

      {activities.length === 0 && (
        <p className="empty-state">No activities yet.</p>
      )}

      <ul className="list-plain">
        {activities.map((activity) => (
          <li key={activity.id} className="card">
            <Link to={`/activities/${activity.id}`} className="card-link">
              <div className="card-row">
                <div>
                  <strong>{activity.title}</strong>
                  <p className="card-subtitle">{activity.type}</p>
                </div>
                <span
                  className="badge"
                  style={{ background: getStatusColor(activity.status) }}
                >
                  {activity.status}
                </span>
              </div>
              {activity.dueDate && (
                <p className="card-meta">
                  Due: {new Date(activity.dueDate).toLocaleString()}
                </p>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
