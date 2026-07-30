import { Link, NavLink, useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

export default function Navbar({ onOpenModal, theme, onToggleTheme }) {
  const navigate = useNavigate();
  const currentRole = localStorage.getItem("serveiq_role");

  const logout = () => {
    localStorage.removeItem("serveiq_role");
    localStorage.removeItem("serveiq_email");
    localStorage.removeItem("serveiq_status");
    navigate("/services");
  };

  const isProvider = currentRole === "provider";
  const isSignedIn = Boolean(currentRole);
  const providerLink = isProvider ? "/provider/dashboard" : "/providers";
  const providerLabel = isProvider ? "Dashboard" : "Providers";

  const navLinkClass = ({ isActive }) => `nav-link${isActive ? " active" : ""}`;

  return (
    <nav>
      <div className="nav-inner">
        <Link to="/services" className="logo">
          <span className="logo-dot" />
          ServeIQ
        </Link>
        <ul className="nav-links">
          <li><NavLink to="/services" className={navLinkClass}>Services</NavLink></li>
          <li><NavLink to={providerLink} className={navLinkClass}>{providerLabel}</NavLink></li>
          <li><NavLink to="/booking" className={navLinkClass}>Booking</NavLink></li>
          <li><NavLink to="/payment" className={navLinkClass}>Payment</NavLink></li>
          <li><NavLink to="/testimonials" className={navLinkClass}>Testimonials</NavLink></li>
          <li><NavLink to="/research" className={navLinkClass}>Research</NavLink></li>
        </ul>
        <div className="nav-cta">
          <ThemeToggle theme={theme} onToggle={onToggleTheme} compact />
          {isProvider ? (
            <>
              <Link to="/provider/dashboard" className="btn btn-ghost">
                Provider Dashboard
              </Link>
              <button type="button" className="btn btn-primary" onClick={logout}>
                Logout
              </button>
            </>
          ) : isSignedIn ? (
            <>
              <Link to="/booking" className="btn btn-ghost">
                Book a service
              </Link>
              <button type="button" className="btn btn-primary" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary">Get Started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
