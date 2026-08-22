import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getNotifications } from "../api/notifications";
import {
  LayoutDashboard,
  ListChecks,
  Megaphone,
  Bell,
  FolderKanban,
  UserCircle,
  LogOut,
  Menu,
  X,
} from "lucide-react";

export default function NavBar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!user) return;
    async function loadUnread() {
      try {
        const res = await getNotifications();
        setUnread(res.data.filter((n) => !n.isRead).length);
      } catch {}
    }
    loadUnread();
    const interval = setInterval(loadUnread, 30000);
    return () => clearInterval(interval);
  }, [user, location.pathname]);

  if (!user) return null;

  const dashboardPath =
    user.role === "ADMIN" ? "/admin/dashboard" : "/dashboard";

  const links = [
    { to: dashboardPath, label: "Dashboard", icon: LayoutDashboard },
    { to: "/activities", label: "Activities", icon: ListChecks },
    { to: "/announcements", label: "Announcements", icon: Megaphone },
    { to: "/notifications", label: "Notifications", icon: Bell, badge: unread },
    ...(user.role === "ADMIN"
      ? [{ to: "/categories", label: "Categories", icon: FolderKanban }]
      : []),
    { to: "/profile", label: "Profile", icon: UserCircle },
  ];

  function isActive(path) {
    return location.pathname === path;
  }

  return (
    <nav className="navbar">
      <Link to={dashboardPath} className="navbar-brand">
        DevClass
      </Link>

      <button
        className="navbar-toggle"
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      <div className={`navbar-links ${open ? "navbar-links-open" : ""}`}>
        {links.map(({ to, label, icon: Icon, badge }) => (
          <Link
            key={to}
            to={to}
            className={`navbar-icon-link ${isActive(to) ? "navbar-link-active" : ""}`}
            onClick={() => setOpen(false)}
            data-tooltip={label}
          >
            <span className="navbar-icon-wrap">
              <Icon size={20} />
              {badge > 0 && (
                <span className="navbar-badge">{badge > 9 ? "9+" : badge}</span>
              )}
            </span>
            <span className="navbar-mobile-label">{label}</span>
          </Link>
        ))}

        <div className="navbar-user">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="navbar-avatar-img"
            />
          ) : (
            <div className="navbar-avatar">{user.name?.[0]?.toUpperCase()}</div>
          )}
          <button
            onClick={logout}
            className="navbar-logout"
            data-tooltip="Log out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </nav>
  );
}
