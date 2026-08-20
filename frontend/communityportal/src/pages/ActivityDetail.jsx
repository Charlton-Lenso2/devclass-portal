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

  if (error) return <p className="form-error">{error}</p>;
  if (!activity) return <p>Loading...</p>;

  return (
    <div className="page-container">
      <Link to="/activities" className="detail-back">
        &larr; Back to Activities
      </Link>

      <div className="card-row">
        <h1>{activity.title}</h1>
        <span
          className="badge"
          style={{ background: getStatusColor(activity.status) }}
        >
          {activity.status}
        </span>
      </div>

      <p className="detail-field">
        <strong>Type:</strong> {activity.type}
      </p>
      {activity.category && (
        <p className="detail-field">
          <strong>Category:</strong> {activity.category.name}
        </p>
      )}
      {activity.description && (
        <p className="detail-field">{activity.description}</p>
      )}
      {activity.location && (
        <p className="detail-field">
          <strong>Location:</strong> {activity.location}
        </p>
      )}
      {activity.startDate && (
        <p className="detail-field">
          <strong>Starts:</strong>{" "}
          {new Date(activity.startDate).toLocaleString()}
        </p>
      )}
      {activity.dueDate && (
        <p className="detail-field">
          <strong>Due:</strong> {new Date(activity.dueDate).toLocaleString()}
        </p>
      )}
      <p className="card-meta">Posted by {activity.createdBy?.name}</p>

      {user?.role === "ADMIN" && (
        <div className="detail-actions">
          <Link to={`/activities/${activity.id}/edit`}>
            <button className="btn-secondary">Edit</button>
          </Link>
          <button onClick={handleArchive} className="btn-danger">
            Archive
          </button>
        </div>
      )}
    </div>
  );
}
