import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const res = await api.get("/categories");
      setCategories(res.data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setError("");
    try {
      await api.post("/categories", { name });
      setName("");
      load();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create category");
    }
  }

  function startEdit(cat) {
    setEditingId(cat.id);
    setEditName(cat.name);
  }

  async function handleUpdate(id) {
    setError("");
    try {
      await api.put(`/categories/${id}`, { name: editName });
      setEditingId(null);
      load();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update category");
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this category?")) return;
    setError("");
    try {
      await api.delete(`/categories/${id}`);
      load();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete category");
    }
  }

  if (loading) return <p className="loading-state">Loading...</p>;

  return (
    <div className="page-container">
      <h1>Manage Categories</h1>

      <form
        onSubmit={handleCreate}
        className="form-stack"
        style={{ flexDirection: "row", maxWidth: "none", marginBottom: 20 }}
      >
        <input
          placeholder="New category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ flex: 1 }}
        />
        <button type="submit" className="btn-primary">
          Add
        </button>
      </form>

      {error && <p className="form-error">{error}</p>}

      {categories.length === 0 && (
        <p className="empty-state">No categories yet.</p>
      )}

      <ul className="list-plain">
        {categories.map((cat) => (
          <li key={cat.id} className="card card-row">
            {editingId === cat.id ? (
              <>
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  style={{ flex: 1, marginRight: 10 }}
                />
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => handleUpdate(cat.id)}
                    className="btn-primary"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <span>{cat.name}</span>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => startEdit(cat)}
                    className="btn-secondary"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="btn-danger"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
