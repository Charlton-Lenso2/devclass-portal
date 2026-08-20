import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getActivityById, archiveActivity } from "../api/activities";
import { getStatusColor } from "../utils/statusBadge";
import { useAuth } from "../context/AuthContext";

export default function ActivityDetail() {
  const { id } = useParams();
  const [activity, setActivity] = useState(null);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const res = await getActivityById(id);
        setActivity(res.data);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load activity");
      }
    }
    load();
  }, [id]);

  async function handleArchive() {
    if (!confirm("Archive this activity?")) return;
    try {
      await archiveActivity(id);
      navigate("/activities");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to archive");
    }
  }

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!activity) return <p>Loading...</p>;

  return (
    <div>
      <Link to="/activities">&larr; Back to Activities</Link>
      <div style={{ marginTop: 16 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1>{activity.title}</h1>
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

        <p>
          <strong>Type:</strong> {activity.type}
        </p>
        {activity.category && (
          <p>
            <strong>Category:</strong> {activity.category.name}
          </p>
        )}
        {activity.description && <p>{activity.description}</p>}
        {activity.location && (
          <p>
            <strong>Location:</strong> {activity.location}
          </p>
        )}
        {activity.startDate && (
          <p>
            <strong>Starts:</strong>{" "}
            {new Date(activity.startDate).toLocaleString()}
          </p>
        )}
        {activity.dueDate && (
          <p>
            <strong>Due:</strong> {new Date(activity.dueDate).toLocaleString()}
          </p>
        )}
        <p style={{ fontSize: 13, color: "#777" }}>
          Posted by {activity.createdBy?.name}
        </p>

        {user?.role === "ADMIN" && (
          <div style={{ marginTop: 20 }}>
            <Link to={`/activities/${activity.id}/edit`}>
              <button>Edit</button>
            </Link>
            <button onClick={handleArchive} style={{ marginLeft: 8 }}>
              Archive
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
