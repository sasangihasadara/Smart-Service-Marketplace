import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";

const menuItems = [
  { label: "Overview", to: "/admin" },
  { label: "Users", to: "/admin/users" },
  { label: "Bookings", to: "/admin/bookings" },
  { label: "Providers", to: "/admin/providers" },
  { label: "Fraud Monitor", to: "/admin/fraud" },
];

export default function AdminLayout({ theme, onToggleTheme }) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPage = menuItems.find((item) => item.to === location.pathname)?.label || "Admin workspace";

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span className="logo-dot" />
          <div>
            <div className="admin-brand-title">ServeIQ</div>
            <div className="admin-brand-sub">Admin Console</div>
          </div>
        </div>
        <div className="admin-nav">
          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/admin"}
              className={({ isActive }) => `admin-nav-item ${isActive ? "active" : ""}`}
            >
              <span className="admin-nav-label">{item.label}</span>
            </NavLink>
          ))}
        </div>
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        <button
          type="button"
          className="btn btn-ghost admin-logout"
          onClick={() => {
            localStorage.removeItem("serveiq_token");
            localStorage.removeItem("serveiq_role");
            localStorage.removeItem("serveiq_email");
            localStorage.removeItem("serveiq_status");
            navigate("/user");
          }}
        >
          Logout
        </button>
      </aside>
      <main className="admin-main">
        <div className="admin-workspace-bar">
          <div>
            <span className="admin-workspace-kicker">ServeIQ / Admin</span>
            <strong>{currentPage}</strong>
          </div>
          <span className="admin-workspace-status"><i /> Operations online</span>
        </div>
        <Outlet />
      </main>
    </div>
  );
}
