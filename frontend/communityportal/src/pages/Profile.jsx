import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { UserCircle, Mail, Lock, ShieldCheck } from "lucide-react";

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
      <div className="profile-header">
        <div className="profile-avatar-large">{name?.[0]?.toUpperCase()}</div>
        <div>
          <h1 style={{ margin: 0 }}>{name}</h1>
          <span className="role-pill">
            <ShieldCheck size={13} />
            {user?.role}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="form-stack">
        <label>
          <span className="label-with-icon">
            <UserCircle size={15} /> Name
          </span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>

        <label>
          <span className="label-with-icon">
            <Mail size={15} /> Email
          </span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label>
          <span className="label-with-icon">
            <Lock size={15} /> New Password
          </span>
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
