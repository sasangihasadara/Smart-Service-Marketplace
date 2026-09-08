import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

export default function Navbar({ theme, onToggleTheme }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const currentRole = localStorage.getItem("serveiq_role");

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

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
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="site-nav">
      <div className="nav-inner">
        <Link to="/services" className="logo" onClick={closeMenu} aria-label="ServeIQ home">
          <span className="logo-dot" />
          ServeIQ
        </Link>

        <button
          type="button"
          className="nav-menu-toggle"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
        >
          <span />
          <span />
        </button>

        <div id="primary-navigation" className={`nav-menu${menuOpen ? " open" : ""}`}>
          <ul className="nav-links">
            <li><NavLink to="/services" className={navLinkClass} onClick={closeMenu}>Services</NavLink></li>
            <li><NavLink to={providerLink} className={navLinkClass} onClick={closeMenu}>{providerLabel}</NavLink></li>
            <li><NavLink to="/booking" className={navLinkClass} onClick={closeMenu}>Bookings</NavLink></li>
            <li><NavLink to="/testimonials" className={navLinkClass} onClick={closeMenu}>Reviews</NavLink></li>
          </ul>

          <div className="nav-cta">
            <ThemeToggle theme={theme} onToggle={onToggleTheme} compact />
            {isProvider ? (
              <>
                <Link to="/provider/dashboard" className="btn btn-ghost" onClick={closeMenu}>Provider dashboard</Link>
                <button type="button" className="btn btn-primary" onClick={logout}>Logout</button>
              </>
            ) : isSignedIn ? (
              <>
                <Link to="/booking" className="btn btn-ghost" onClick={closeMenu}>Book a service</Link>
                <button type="button" className="btn btn-primary" onClick={logout}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost" onClick={closeMenu}>Sign in</Link>
                <Link to="/register" className="btn btn-primary" onClick={closeMenu}>Get started</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
