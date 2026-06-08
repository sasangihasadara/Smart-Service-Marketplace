import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ onOpenModal }) {
  const navigate = useNavigate();
  const currentRole = localStorage.getItem("serveiq_role");

  const logout = () => {
    localStorage.removeItem("serveiq_role");
    localStorage.removeItem("serveiq_email");
    navigate("/services");
  };

  const isProvider = currentRole === "provider";

  return (
    <nav>
      <div className="nav-inner">
        <Link to="/services" className="logo">
          <span className="logo-dot" />
          ServeIQ
        </Link>
        <ul className="nav-links">
          <li><Link to="/services">Services</Link></li>
          <li><Link to={isProvider ? "/provider/dashboard" : "/providers"}>{isProvider ? "Dashboard" : "Providers"}</Link></li>
          <li><Link to="/booking">Booking</Link></li>
          <li><Link to="/payment">Payment</Link></li>
          <li><Link to="/testimonials">Testimonials</Link></li>
          <li><Link to="/research">Research</Link></li>
        </ul>
        <div className="nav-cta">
          {isProvider ? (
            <>
              <Link to="/provider/dashboard" className="btn btn-ghost">
                Provider Dashboard
              </Link>
              <button type="button" className="btn btn-primary" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button type="button" className="btn btn-ghost" onClick={() => onOpenModal("login")}>
                Sign In
              </button>
              <Link to="/register" className="btn btn-primary">Get Started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
