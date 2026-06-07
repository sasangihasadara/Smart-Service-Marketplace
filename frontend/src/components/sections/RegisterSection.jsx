import { registerFeatures } from "../../data/serveiqData";
export default function RegisterSection({ onOpenModal }) {
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
          <button type="button" className="btn btn-white btn-lg" onClick={() => onOpenModal("register")}>Register as Provider</button>
          <button type="button" className="btn btn-outline-white btn-lg" onClick={() => onOpenModal("login")}>Customer Sign Up</button>
        </div>
      </div>
    </section>
  );
}
