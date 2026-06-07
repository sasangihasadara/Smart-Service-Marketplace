import { Link } from "react-router-dom";

export default function Navbar({ onOpenModal }) {
  return (
    <nav>
      <div className="nav-inner">
        <Link to="/services" className="logo">
          <span className="logo-dot" />
          ServeIQ
        </Link>
        <ul className="nav-links">
          <li><Link to="/services">Services</Link></li>
          <li><Link to="/providers">Providers</Link></li>
          <li><Link to="/booking">Booking</Link></li>
          <li><Link to="/payment">Payment</Link></li>
          <li><Link to="/testimonials">Testimonials</Link></li>
          <li><Link to="/research">Research</Link></li>
        </ul>
        <div className="nav-cta">
          <button type="button" className="btn btn-ghost" onClick={() => onOpenModal("login")}>
            Sign In
          </button>
          <Link to="/register" className="btn btn-primary">Get Started</Link>
        </div>
      </div>
    </nav>
  );
}
