import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer>
      <div className="footer-grid">
        <div className="footer-brand">
          <Link to="/services" className="logo">
            <span className="logo-dot" />
            ServeIQ
          </Link>
          <p>AI-Powered Service Marketplace connecting customers with trusted professionals across Sri Lanka.</p>
          <div className="social-row">
            <div className="social-icon">📘</div>
            <div className="social-icon">🐦</div>
            <div className="social-icon">📸</div>
          </div>
        </div>
        <div>
          <div className="footer-col-title">Services</div>
          <ul className="footer-links">
            <li><Link to="/services">Electricians</Link></li>
            <li><Link to="/services">Plumbers</Link></li>
            <li><Link to="/services">AC Technicians</Link></li>
            <li><Link to="/services">Tutors</Link></li>
            <li><Link to="/services">Cleaners</Link></li>
          </ul>
        </div>
        <div>
          <div className="footer-col-title">Platform</div>
          <ul className="footer-links">
            <li><Link to="/services">How It Works</Link></li>
            <li><Link to="/research">AI Matching</Link></li>
            <li><Link to="/research">Fraud Protection</Link></li>
            <li><Link to="/payment">Payment Security</Link></li>
            <li><Link to="/services">Mobile App</Link></li>
          </ul>
        </div>
        <div>
          <div className="footer-col-title">Providers</div>
          <ul className="footer-links">
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/providers">Provider Dashboard</Link></li>
            <li><Link to="/providers">Earnings</Link></li>
            <li><Link to="/providers">Verification</Link></li>
            <li><Link to="/services">Support</Link></li>
          </ul>
        </div>
        <div>
          <div className="footer-col-title">Company</div>
          <ul className="footer-links">
            <li><Link to="/services">About</Link></li>
            <li><Link to="/research">Research</Link></li>
            <li><Link to="/services">Privacy Policy</Link></li>
            <li><Link to="/services">Terms of Service</Link></li>
            <li><Link to="/services">Contact</Link></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2025 ServeIQ - AI-Powered Service Marketplace. Final Year Project.</span>
        <span>Powered by React · Spring Boot · Scikit-learn · PayHere</span>
      </div>
    </footer>
  );
}
