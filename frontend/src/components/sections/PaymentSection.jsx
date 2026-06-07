import { paymentFeatures } from "../../data/serveiqData";
import SectionHeader from "../SectionHeader";

export default function PaymentSection({ paymentMethod, setPaymentMethod, onToast }) {
  return (
    <section id="payment">
      <div className="container">
        <div className="payment-grid">
          <div>
            <SectionHeader label="💳 Payment Gateway" title="Secure Payments via PayHere" />
            <p className="section-sub payment-copy">
              Every transaction is encrypted with TLS and verified by PayHere's fraud prevention. Full payment lifecycle management built-in.
            </p>
            <div className="payment-features">
              {paymentFeatures.map((feature) => (
                <div className="payment-feature" key={feature.title}>
                  <span className="payment-feature-icon">{feature.icon}</span>
                  <div>
                    <h4>{feature.title}</h4>
                    <p>{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="payment-card">
              <div className="payment-header">
                <div>
                  <div className="payment-small">Service Booking</div>
                  <div className="payment-service">Electrical Repair - Kasun Perera</div>
                </div>
                <div className="payhere-badge">PayHere</div>
              </div>
              <div className="payment-amount">LKR 7,500</div>
              <div className="payment-sub">Includes 2.5 hrs service + call-out fee</div>
              <div className="payment-methods">
                {[
                  ["card", "💳 Card"],
                  ["bank", "🏦 Bank"],
                  ["wallet", "📱 Wallet"],
                ].map(([method, label]) => (
                  <button
                    type="button"
                    key={method}
                    className={`pay-method ${paymentMethod === method ? "active" : ""}`}
                    onClick={() => setPaymentMethod(method)}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="card-preview">
                <div className="card-preview-label">Card Number</div>
                <div className="card-preview-number">•••• •••• •••• 4242</div>
              </div>
              <button type="button" className="pay-btn" onClick={() => onToast("Payment processed successfully! Invoice sent to email.")}>
                Pay LKR 7,500
              </button>
              <div className="payment-security">🔒 Secured by PayHere · PCI DSS Compliant</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

