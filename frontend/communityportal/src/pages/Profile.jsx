import { useEffect, useState, useRef } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, ShieldCheck, Camera } from "lucide-react";

export default function Profile() {
  const { user, setUser } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);

  useEffect(() => {
    async function load() {
      const res = await api.get("/users/me");
      setName(res.data.name);
      setEmail(res.data.email);
      setAvatar(res.data.avatar || null);
      setLoading(false);
    }
    load();
  }, []);

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 1_500_000) {
      setError("Image must be under 1.5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result);
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const payload = { name, email, avatar };
      if (password) payload.password = password;

      const res = await api.put("/users/me", payload);
      setPassword("");
      setMessage("Profile updated successfully.");
      if (setUser) setUser(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update profile");
    }
  }

  if (loading) return <p className="loading-state">Loading...</p>;

  return (
    <div className="page-container">
      <div className="profile-header">
        <div
          className="avatar-upload"
          onClick={() => fileInputRef.current.click()}
        >
          {avatar ? (
            <img src={avatar} alt={name} className="profile-avatar-img" />
          ) : (
            <div className="profile-avatar-large">
              {name?.[0]?.toUpperCase()}
            </div>
          )}
          <div className="avatar-upload-overlay">
            <Camera size={18} />
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            hidden
          />
        </div>
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
          Name
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
