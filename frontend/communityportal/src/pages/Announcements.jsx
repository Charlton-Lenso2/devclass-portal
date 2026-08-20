import { useEffect, useState } from "react";
import { getAnnouncements, createAnnouncement } from "../api/announcements";
import { useAuth } from "../context/AuthContext";

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const { user } = useAuth();

  async function load() {
    try {
      const res = await getAnnouncements();
      setAnnouncements(res.data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await createAnnouncement({ title, content });
      setTitle("");
      setContent("");
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to post announcement");
    }
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Announcements</h1>
        {user?.role === "ADMIN" && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary"
          >
            {showForm ? "Cancel" : "+ New Announcement"}
          </button>
        )}
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="form-stack"
          style={{ marginBottom: 20 }}
        >
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            required
          />
          {error && <p className="form-error">{error}</p>}
          <button type="submit" className="btn-primary">
            Post
          </button>
        </form>
      )}

      {announcements.length === 0 && (
        <p className="empty-state">No announcements yet.</p>
      )}

      <ul className="list-plain">
        {announcements.map((a) => (
          <li key={a.id} className="card">
            <strong>{a.title}</strong>
            <p className="card-subtitle">{a.content}</p>
            <span className="card-meta">
              {a.createdBy?.name} · {new Date(a.createdAt).toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
