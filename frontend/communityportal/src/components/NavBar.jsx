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
      {user.role === "ADMIN" && <Link to="/categories">Categories</Link>}
      <Link to="/profile">Profile</Link>
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
