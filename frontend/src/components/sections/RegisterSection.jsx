import { Link } from "react-router-dom";
import { registerFeatures } from "../../data/serveiqData";
export default function RegisterSection() {
  return (
    <section id="register">
      <div className="container">
        <div className="section-label" style={{ background: "rgba(255,255,255,0.15)", color: "white" }}>
          🚀 Join ServeIQ
        </div>
        <h2 className="section-title">Start Earning Today</h2>
        <p>
          Register as a service provider and get matched with customers in your area. ServeIQ handles the booking, payment, and notifications - you focus on the work.
        </p>
        <div className="register-features">
          {registerFeatures.map((feature) => (
            <div className="register-feature" key={feature}>
              <div className="check-circle">✓</div>
              {feature}
            </div>
          ))}
        </div>
        <div className="register-actions">
          <Link to="/register?mode=register&role=provider" className="btn btn-white btn-lg">Register as Provider</Link>
          <Link to="/register?mode=register&role=customer" className="btn btn-outline-white btn-lg">Customer Sign Up</Link>
        </div>
      </div>
    </section>
  );
}
