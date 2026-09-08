import { Link } from "react-router-dom";

const serviceLinks = [
  ["Electricians", "/category/electricians"],
  ["Plumbers", "/category/plumbers"],
  ["AC technicians", "/category/ac-technicians"],
  ["Home cleaning", "/category/cleaners"],
];

export default function Footer() {
  return (
    <footer>
      <div className="footer-grid">
        <div className="footer-brand">
          <Link to="/services" className="logo">
            <span className="logo-dot" />
            ServeIQ
          </Link>
          <p>Find reliable local professionals and manage every service booking in one trusted place.</p>
          <a className="footer-contact" href="mailto:support@serveiq.lk">support@serveiq.lk</a>
        </div>
        <div>
          <div className="footer-col-title">Popular services</div>
          <ul className="footer-links">
            {serviceLinks.map(([label, to]) => <li key={to}><Link to={to}>{label}</Link></li>)}
          </ul>
        </div>
        <div>
          <div className="footer-col-title">For customers</div>
          <ul className="footer-links">
            <li><Link to="/providers">Browse professionals</Link></li>
            <li><Link to="/booking">Manage a booking</Link></li>
            <li><Link to="/payment">Payments and invoices</Link></li>
            <li><Link to="/testimonials">Verified reviews</Link></li>
          </ul>
        </div>
        <div>
          <div className="footer-col-title">For providers</div>
          <ul className="footer-links">
            <li><Link to="/register?mode=register&role=provider">Join ServeIQ</Link></li>
            <li><Link to="/providers">Explore the marketplace</Link></li>
            <li><Link to="/research">How matching works</Link></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} ServeIQ. All rights reserved.</span>
        <span>Secure bookings · Verified professionals · Sri Lanka</span>
      </div>
    </footer>
  );
}
