import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await api.get("/users/me");
      setName(res.data.name);
      setEmail(res.data.email);
      setLoading(false);
    }
    load();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const payload = { name, email };
      if (password) payload.password = password;

      await api.put("/users/me", payload);
      setPassword("");
      setMessage("Profile updated successfully.");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update profile");
    }
  }

  if (loading) return <p className="loading-state">Loading...</p>;

  return (
    <div className="page-container">
      <h1>My Profile</h1>
      <p className="card-meta" style={{ marginBottom: 20 }}>
        Role: {user?.role}
      </p>

      <form onSubmit={handleSubmit} className="form-stack">
        <label>
          Name
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>

        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label>
          New Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Leave blank to keep current password"
          />
        </label>

        {error && <p className="form-error">{error}</p>}
        {message && (
          <p style={{ color: "var(--color-success)", fontSize: 14 }}>
            {message}
          </p>
        )}

        <button type="submit" className="btn-primary">
          Save Changes
        </button>
      </form>
    </div>
  );
}
