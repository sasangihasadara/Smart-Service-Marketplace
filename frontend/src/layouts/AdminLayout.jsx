import { NavLink, Outlet, useNavigate } from "react-router-dom";

const menuItems = [
  { label: "Overview", to: "/admin" },
  { label: "Users", to: "/admin/users" },
  { label: "Bookings", to: "/admin/bookings" },
  { label: "Providers", to: "/admin/providers" },
  { label: "Fraud Monitor", to: "/admin/fraud" },
];

export default function AdminLayout() {
  const navigate = useNavigate();

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
        <button
          type="button"
          className="btn btn-ghost admin-logout"
          onClick={() => {
            localStorage.removeItem("serveiq_role");
            localStorage.removeItem("serveiq_email");
            navigate("/user");
          }}
        >
          Logout
        </button>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
