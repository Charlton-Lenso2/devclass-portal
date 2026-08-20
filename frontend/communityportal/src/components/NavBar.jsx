import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function NavBar() {
  const { user, logout } = useAuth();
  if (!user) return null;

  const dashboardPath =
    user.role === "ADMIN" ? "/admin/dashboard" : "/dashboard";

  return (
    <nav className="navbar">
      <Link to={dashboardPath}>Dashboard</Link>
      <Link to="/activities">Activities</Link>
      <Link to="/announcements">Announcements</Link>
      <Link to="/notifications">Notifications</Link>
      <div className="navbar-user">
        <span>
          {user.name} ({user.role})
        </span>
        <button onClick={logout} className="btn-primary">
          Log out
        </button>
      </div>
    </nav>
  );
}
