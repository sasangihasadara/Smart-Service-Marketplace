import { useEffect, useMemo, useState } from "react";
import { paymentFeatures } from "../../data/serveiqData";
import SectionHeader from "../SectionHeader";

function toNumber(value) {
  const parsed = Number.parseFloat(String(value));
  return Number.isFinite(parsed) ? parsed : 0;
}

export default function PaymentSection({ booking, paymentMethod, setPaymentMethod, onToast, onPay }) {
  const [payerName, setPayerName] = useState(booking?.customerName || "");
  const [payerEmail, setPayerEmail] = useState(booking?.customerEmail || "");

  useEffect(() => {
    setPayerName(booking?.customerName || "");
    setPayerEmail(booking?.customerEmail || "");
  }, [booking]);

  const amount = useMemo(() => {
    const bookingAmount = booking?.totalAmount ?? 7500;
    return toNumber(bookingAmount);
  }, [booking]);

  const serviceName = booking?.serviceRequired || "Electrical Repair";
  const providerName = booking?.providerName || "Kasun Perera";

  const submitPayment = async () => {
    try {
      await onPay?.({
        bookingCode: booking?.bookingCode,
        payerName,
        payerEmail,
        method: paymentMethod,
        amount,
      });
    } catch (error) {
      onToast?.(error?.message || "Payment could not be saved.");
    }
  };

  return (
    <section id="payment">
      <div className="container">
        <div className="payment-grid">
          <div>
            <SectionHeader label="💳 Payment Gateway" title="Secure Payments via PayHere" />
            <p className="section-sub payment-copy">
              Every transaction is encrypted with TLS and verified by PayHere&apos;s fraud prevention. Full payment lifecycle management built-in.
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
                  <div className="payment-service">{serviceName} - {providerName}</div>
                </div>
                <div className="payhere-badge">PayHere</div>
              </div>
              <div className="payment-amount">LKR {amount.toFixed(0)}</div>
              <div className="payment-sub">Includes service fee and call-out fee</div>
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
              <div className="form-group">
                <label>Payer Name</label>
                <input type="text" value={payerName} onChange={(event) => setPayerName(event.target.value)} />
              </div>
              <div className="form-group">
                <label>Payer Email</label>
                <input type="email" value={payerEmail} onChange={(event) => setPayerEmail(event.target.value)} />
              </div>
              <div className="card-preview">
                <div className="card-preview-label">Booking Reference</div>
                <div className="card-preview-number">{booking?.bookingCode || "Save a booking first"}</div>
              </div>
              <button type="button" className="pay-btn" onClick={submitPayment} disabled={!booking?.bookingCode}>
                Pay LKR {amount.toFixed(0)}
              </button>
              <div className="payment-security">🔒 Secured by PayHere · PCI DSS Compliant</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
