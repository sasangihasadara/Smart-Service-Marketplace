import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { paymentFeatures } from "../../data/serveiqData";
import SectionHeader from "../SectionHeader";

const paymentMethods = [
  {
    key: "card",
    title: "Card",
    subtitle: "Instant authorization",
    note: "Processed through PayHere with secure hosted fields and 3-D Secure support.",
  },
  {
    key: "bank",
    title: "Bank Transfer",
    subtitle: "Manual settlement",
    note: "Use your booking reference in the transfer narration for quick reconciliation.",
  },
  {
    key: "wallet",
    title: "Wallet",
    subtitle: "Mobile checkout",
    note: "Approve the payment from your wallet app for a fast mobile confirmation flow.",
  },
];

function toNumber(value) {
  const parsed = Number.parseFloat(String(value));
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatAmount(value) {
  return new Intl.NumberFormat("en-LK", {
    maximumFractionDigits: 0,
  }).format(toNumber(value));
}

function formatSchedule(booking) {
  if (!booking?.bookingDate && !booking?.bookingTime) {
    return "Not scheduled yet";
  }

  if (booking?.bookingDate && booking?.bookingTime) {
    return `${booking.bookingDate} at ${booking.bookingTime}`;
  }

  return booking?.bookingDate || booking?.bookingTime || "Not scheduled yet";
}

function formatDateTime(value) {
  if (!value) {
    return "Just now";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return String(value);
  }

  return parsed.toLocaleString("en-LK", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function PaymentSection({ booking, paymentMethod, setPaymentMethod, onToast, onPay }) {
  const navigate = useNavigate();
  const [payerName, setPayerName] = useState(booking?.customerName || "");
  const [payerEmail, setPayerEmail] = useState(booking?.customerEmail || "");
  const [cardHolder, setCardHolder] = useState(booking?.customerName || "");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setPayerName(booking?.customerName || "");
    setPayerEmail(booking?.customerEmail || "");
    setCardHolder(booking?.customerName || "");
    setCardNumber("");
    setCardExpiry("");
    setCardCvv("");
    setReceipt(null);
    setErrorMessage("");
  }, [booking?.bookingCode]);

  const amount = useMemo(() => {
    const bookingAmount = booking?.totalAmount ?? 0;
    return toNumber(bookingAmount);
  }, [booking]);

  const hasBooking = Boolean(booking?.bookingCode);
  const selectedMethod = paymentMethods.find((item) => item.key === paymentMethod) || paymentMethods[0];
  const serviceName = booking?.serviceRequired || "Service booking";
  const providerName = booking?.providerName || "Assigned provider";
  const schedule = formatSchedule(booking);
  const contactEmail = booking?.customerEmail || payerEmail || "Not provided";
  const contactPhone = booking?.customerPhone || "Not provided";
  const location = booking?.location || "Not provided";
  const serviceFee = toNumber(booking?.serviceFee);
  const callOutFee = toNumber(booking?.callOutFee);
  const hasFeeBreakdown = booking?.serviceFee != null || booking?.callOutFee != null;
  const receiptReference = receipt?.paymentReference || booking?.paymentReference || booking?.bookingCode || "Pending";

  const orderDetails = [
    { label: "Booking code", value: booking?.bookingCode || "Waiting for booking" },
    { label: "Service", value: serviceName },
    { label: "Provider", value: providerName },
    { label: "Schedule", value: schedule },
    { label: "Location", value: location },
    { label: "Customer", value: payerName || booking?.customerName || "Not filled" },
    { label: "Email", value: contactEmail },
    { label: "Phone", value: contactPhone },
  ];

  const submitPayment = async () => {
    if (!hasBooking) {
      setErrorMessage("Save a booking first before continuing to payment.");
      return;
    }

    if (!payerName.trim() || !payerEmail.trim()) {
      setErrorMessage("Please enter the payer name and email.");
      return;
    }

    if (paymentMethod === "card") {
      if (!cardHolder.trim() || !cardNumber.trim() || !cardExpiry.trim() || !cardCvv.trim()) {
        setErrorMessage("Complete the card details before confirming the payment.");
        return;
      }
    }

    if (!onPay) {
      setErrorMessage("Payment submission is not available right now.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const result = await onPay({
        bookingCode: booking?.bookingCode,
        payerName: payerName.trim(),
        payerEmail: payerEmail.trim(),
        method: paymentMethod,
        amount,
      });
      const receiptData = result || {};

      setReceipt({
        ...receiptData,
        paymentReference: receiptData.paymentReference || `PAY-${Date.now().toString().slice(-6)}`,
        bookingCode: receiptData.bookingCode || booking?.bookingCode,
        amount: receiptData.amount ?? amount,
        method: receiptData.method || paymentMethod,
        payerName: receiptData.payerName || payerName.trim(),
        payerEmail: receiptData.payerEmail || payerEmail.trim(),
        createdAt: receiptData.createdAt || new Date().toISOString(),
      });
    } catch (error) {
      const message = error?.message || "Payment could not be saved.";
      setErrorMessage(message);
      onToast?.(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isCardMethod = paymentMethod === "card";
  const actionLabel = `Pay LKR ${formatAmount(amount)}`;

  return (
    <section id="payment" className="payment-section">
      <div className="container">
        <div className="payment-layout">
          <div className="payment-intro fade-up">
            <SectionHeader
              label="Secure Checkout"
              title="Complete your booking with confidence."
              subtitle="Your booking, payment record, and receipt stay connected in one clear, secure checkout flow."
              dark
            />

            <div className="payment-safety-strip">
              <div className="payment-safety-chip">
                <strong>TLS</strong>
                <span>Encrypted session</span>
              </div>
              <div className="payment-safety-chip">
                <strong>PCI</strong>
                <span>Gateway-ready checkout</span>
              </div>
              <div className="payment-safety-chip">
                <strong>Invoice</strong>
                <span>Instant receipt generation</span>
              </div>
            </div>

            <div className="payment-trust-grid">
              {paymentFeatures.map((feature) => (
                <div className="payment-trust-card" key={feature.title}>
                  <h4>{feature.title}</h4>
                  <p>{feature.desc}</p>
                </div>
              ))}
            </div>

            <div className="payment-expectations">
              <div className="payment-expectation">
                <span>1</span>
                <div>
                  <strong>Review</strong>
                  <p>Check the job, price, and provider details before you pay.</p>
                </div>
              </div>
              <div className="payment-expectation">
                <span>2</span>
                <div>
                  <strong>Authorize</strong>
                  <p>Pick card, bank transfer, or wallet and confirm the payment method.</p>
                </div>
              </div>
              <div className="payment-expectation">
                <span>3</span>
                <div>
                  <strong>Receipt</strong>
                  <p>Receive a payment reference and a confirmed booking state immediately.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="payment-panel fade-up">
            {receipt ? (
              <div className="payment-card payment-receipt-card">
                <div className="payment-header">
                  <div>
                    <div className="payment-small">Payment complete</div>
                    <div className="payment-service">Reference {receiptReference}</div>
                  </div>
                  <div className="payhere-badge success">Paid</div>
                </div>

                <div className="payment-amount">LKR {formatAmount(receipt.amount)}</div>
                <div className="payment-sub">
                  {receipt.method?.toString().toUpperCase() || "CARD"} payment recorded for {receipt.bookingCode}
                </div>

                <div className="receipt-grid">
                  {[
                    ["Status", receipt.status || "paid"],
                    ["Payer", receipt.payerName],
                    ["Email", receipt.payerEmail],
                    ["Booked on", formatDateTime(receipt.createdAt)],
                  ].map(([label, value]) => (
                    <div className="receipt-item" key={label}>
                      <span>{label}</span>
                      <strong>{value}</strong>
                    </div>
                  ))}
                </div>

                <div className="receipt-note">
                  Your booking is now confirmed. You can return to the services page or create another booking whenever you are ready.
                </div>

                <div className="receipt-actions">
                  <button type="button" className="btn btn-primary modal-action" onClick={() => navigate("/services")}>
                    Back to services
                  </button>
                  <button type="button" className="btn btn-ghost modal-action" onClick={() => navigate("/booking")}>
                    Book another service
                  </button>
                </div>
              </div>
            ) : !hasBooking ? (
              <div className="payment-empty-card">
                <div className="payment-empty-icon" aria-hidden="true">01</div>
                <div className="payment-small">Checkout waiting</div>
                <h3>Start with a confirmed booking</h3>
                <p>
                  Select a verified provider, choose a date and time, then return here to review the exact price and pay securely.
                </p>
                <div className="payment-empty-list">
                  <span>Verified provider selection</span>
                  <span>Clear booking summary</span>
                  <span>Instant payment receipt</span>
                </div>
                <button type="button" className="btn btn-primary payment-empty-action" onClick={() => navigate("/booking")}>
                  Browse providers
                </button>
              </div>
            ) : (
              <div className="payment-card">
                <div className="payment-header">
                  <div>
                    <div className="payment-small">Checkout summary</div>
                    <div className="payment-service">
                      {serviceName} - {providerName}
                    </div>
                  </div>
                  <div className="payhere-badge success">Ready</div>
                </div>

                <div className="payment-amount">LKR {formatAmount(amount)}</div>
                <div className="payment-sub">
                  Booking total ready for confirmation
                </div>

                <div className="payment-summary-grid">
                  <div className="payment-summary-item">
                    <span>Booking</span>
                    <strong>{booking.bookingCode}</strong>
                  </div>
                  <div className="payment-summary-item">
                    <span>Schedule</span>
                    <strong>{schedule}</strong>
                  </div>
                  <div className="payment-summary-item">
                    <span>Method</span>
                    <strong>{selectedMethod.title}</strong>
                  </div>
                  <div className="payment-summary-item">
                    <span>Status</span>
                    <strong>{booking.status || "pending"}</strong>
                  </div>
                </div>

                <div className="payment-methods" role="tablist" aria-label="Payment methods">
                  {paymentMethods.map((method) => (
                    <button
                      type="button"
                      key={method.key}
                      className={`payment-method-card ${paymentMethod === method.key ? "active" : ""}`}
                      onClick={() => setPaymentMethod?.(method.key)}
                      aria-pressed={paymentMethod === method.key}
                    >
                      <strong>{method.title}</strong>
                      <span>{method.subtitle}</span>
                    </button>
                  ))}
                </div>

                <div className="payment-method-note">{selectedMethod.note}</div>

                <div className="payment-billing-section">
                  <h4>Billing details</h4>
                  <div className="form-group">
                    <label>Payer Name</label>
                    <input
                      type="text"
                      value={payerName}
                      onChange={(event) => setPayerName(event.target.value)}
                      placeholder="Nimali Ratnayake"
                      autoComplete="name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Payer Email</label>
                    <input
                      type="email"
                      value={payerEmail}
                      onChange={(event) => setPayerEmail(event.target.value)}
                      placeholder="you@example.com"
                      autoComplete="email"
                    />
                  </div>

                  {isCardMethod ? (
                    <div className="payment-card-fields">
                      <div className="form-group">
                        <label>Card Holder</label>
                        <input
                          type="text"
                          value={cardHolder}
                          onChange={(event) => setCardHolder(event.target.value)}
                          placeholder="Name on card"
                          autoComplete="cc-name"
                        />
                      </div>
                      <div className="form-group">
                        <label>Card Number</label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(event) => setCardNumber(event.target.value)}
                          placeholder="1234 5678 9012 3456"
                          autoComplete="cc-number"
                        />
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Expiry</label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={(event) => setCardExpiry(event.target.value)}
                            placeholder="MM / YY"
                            autoComplete="cc-exp"
                          />
                        </div>
                        <div className="form-group">
                          <label>CVV</label>
                          <input
                            type="password"
                            value={cardCvv}
                            onChange={(event) => setCardCvv(event.target.value)}
                            placeholder="123"
                            autoComplete="cc-csc"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="payment-bank-note">
                      <strong>{selectedMethod.title} instructions</strong>
                      <p>{selectedMethod.note}</p>
                    </div>
                  )}
                </div>

                <div className="payment-breakdown">
                  <div className="payment-breakdown-row">
                    <span>Booking total</span>
                    <strong>LKR {formatAmount(amount)}</strong>
                  </div>
                  {hasFeeBreakdown ? (
                    <>
                      <div className="payment-breakdown-row">
                        <span>Service fee</span>
                        <strong>LKR {formatAmount(serviceFee)}</strong>
                      </div>
                      <div className="payment-breakdown-row">
                        <span>Call-out fee</span>
                        <strong>LKR {formatAmount(callOutFee)}</strong>
                      </div>
                    </>
                  ) : null}
                  <div className="payment-breakdown-row total">
                    <span>Total to collect</span>
                    <strong>LKR {formatAmount(amount)}</strong>
                  </div>
                </div>

                {errorMessage ? <div className="payment-error">{errorMessage}</div> : null}

                <button
                  type="button"
                  className="pay-btn"
                  onClick={submitPayment}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing payment..." : actionLabel}
                </button>

                <div className="payment-security">Secured by PayHere • PCI DSS ready • Reference sent instantly</div>
              </div>
            )}

            {hasBooking ? (
              <div className="payment-order-card">
                <div className="payment-order-head">
                  <h3>Booking details</h3>
                  <span>{booking.status || "Draft"}</span>
                </div>

                <div className="payment-order-list">
                  {orderDetails.map((item) => (
                    <div className="payment-order-row" key={item.label}>
                      <span>{item.label}</span>
                      <strong>{item.value}</strong>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="payment-journey-card">
                <div className="payment-order-head">
                  <h3>Your checkout journey</h3>
                  <span>3 steps</span>
                </div>
                <ol>
                  <li><strong>Choose</strong><span>Find an approved professional.</span></li>
                  <li><strong>Confirm</strong><span>Save the booking date and service details.</span></li>
                  <li><strong>Pay</strong><span>Return here for a secure payment record.</span></li>
                </ol>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
