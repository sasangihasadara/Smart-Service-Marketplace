import { useNavigate } from "react-router-dom";

const menuItems = [
  ["Overview", "📊"],
  ["Users", "👥"],
  ["Bookings", "📋"],
  ["Payments", "💳"],
  ["Fraud Monitor", "🛡️"],
  ["Providers", "⭐"],
  ["Reports", "📈"],
  ["Settings", "⚙️"],
];

export default function AdminLayout({ onToast, children }) {
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
          {menuItems.map(([label, icon], index) => (
            <button
              type="button"
              key={label}
              className={`admin-nav-item ${index === 0 ? "active" : ""}`}
              onClick={() => index !== 0 && onToast(`Loading ${label.toLowerCase()}...`, "ℹ️")}
            >
              <span>{icon}</span>
              {label}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="btn btn-ghost admin-logout"
          onClick={() => {
            localStorage.removeItem("serveiq_role");
            navigate("/user");
          }}
        >
          Logout
        </button>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}

