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
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>Activities</h1>
        {user?.role === "ADMIN" && (
          <Link to="/activities/new">
            <button>+ New Activity</button>
          </Link>
        )}
      </div>

      {activities.length === 0 && <p>No activities yet.</p>}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {activities.map((activity) => (
          <li
            key={activity.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: 8,
              padding: 16,
              marginBottom: 12,
            }}
          >
            <Link
              to={`/activities/${activity.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <strong>{activity.title}</strong>
                  <p style={{ margin: "4px 0", color: "#555" }}>
                    {activity.type}
                  </p>
                </div>
                <span
                  style={{
                    background: getStatusColor(activity.status),
                    color: "white",
                    padding: "4px 10px",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                >
                  {activity.status}
                </span>
              </div>
              {activity.dueDate && (
                <p style={{ margin: "8px 0 0", fontSize: 13, color: "#777" }}>
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
