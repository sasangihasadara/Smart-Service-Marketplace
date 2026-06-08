import { useEffect, useMemo, useState } from "react";

const registerCategoryOptions = [
  "Electrician",
  "Plumber",
  "AC Technician",
  "Tutor",
  "Cleaner",
  "Photographer",
  "Carpenter",
];

function toNumber(value) {
  const parsed = Number.parseFloat(String(value));
  return Number.isFinite(parsed) ? parsed : 0;
}

export default function Modal({
  modalType,
  modalTab,
  setModalTab,
  modalContext,
  onClose,
  onOpenModal,
  onToast,
  onSignIn,
  onRegister,
  onBook,
}) {
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    serviceCategory: "Electrician",
    yearsOfExperience: 1,
    password: "",
  });
  const [bookingForm, setBookingForm] = useState({
    serviceRequired: "",
    providerName: "",
    bookingDate: "",
    bookingTime: "",
    location: "",
    description: "",
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    serviceFee: 6250,
    callOutFee: 1250,
    paymentMethod: "card",
  });
  const [submitting, setSubmitting] = useState(false);

  const bookingTotal = useMemo(
    () => toNumber(bookingForm.serviceFee) + toNumber(bookingForm.callOutFee),
    [bookingForm.callOutFee, bookingForm.serviceFee]
  );

  useEffect(() => {
    if (!modalType) {
      return;
    }

    if (modalType === "login") {
      setLoginForm((current) => ({
        ...current,
        email: modalContext?.email || current.email,
        password: modalContext?.password || current.password,
      }));
    }

    if (modalType === "register") {
      setRegisterForm((current) => ({
        ...current,
        serviceCategory: modalTab === "provider" ? modalContext?.serviceCategory || current.serviceCategory : "Customer",
      }));
    }

    if (modalType === "booking") {
      const serviceFee = modalContext?.serviceFee ?? 6250;
      const callOutFee = modalContext?.callOutFee ?? 1250;

      setBookingForm({
        serviceRequired: modalContext?.serviceRequired || "",
        providerName: modalContext?.providerName || "",
        bookingDate: modalContext?.bookingDate || "",
        bookingTime: modalContext?.bookingTime || "",
        location: modalContext?.location || "",
        description: modalContext?.description || "",
        customerName: modalContext?.customerName || "",
        customerEmail: modalContext?.customerEmail || "",
        customerPhone: modalContext?.customerPhone || "",
        serviceFee,
        callOutFee,
        paymentMethod: modalContext?.paymentMethod || "card",
      });
    }
  }, [modalContext, modalTab, modalType]);

  const submitLogin = async () => {
    setSubmitting(true);
    try {
      await onSignIn?.({
        ...loginForm,
        role: modalTab,
      });
      onClose();
    } catch (error) {
      onToast?.(error?.message || "Login failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const submitRegister = async () => {
    setSubmitting(true);
    try {
      await onRegister?.({
        ...registerForm,
        role: modalTab,
        yearsOfExperience: Number(registerForm.yearsOfExperience) || 0,
      });
      onClose();
    } catch (error) {
      onToast?.(error?.message || "Registration failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const submitBooking = async () => {
    setSubmitting(true);
    try {
      await onBook?.({
        ...bookingForm,
        serviceFee: toNumber(bookingForm.serviceFee),
        callOutFee: toNumber(bookingForm.callOutFee),
        totalAmount: bookingTotal,
      });
      onClose();
    } catch (error) {
      onToast?.(error?.message || "Booking failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`modal-overlay ${modalType ? "open" : ""}`} onClick={(event) => event.target === event.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <button type="button" className="modal-close" onClick={onClose}>✕</button>

        {modalType === "login" && (
          <>
            <h2 className="modal-title" id="modal-title">Welcome back</h2>
            <p className="modal-sub">Sign in to your ServeIQ account</p>
            <div className="tabs">
              {["Customer", "Provider", "Admin"].map((tab) => (
                <div
                  className={`tab ${modalTab.toLowerCase() === tab.toLowerCase() ? "active" : ""}`}
                  key={tab}
                  onClick={() => setModalTab(tab.toLowerCase())}
                >
                  {tab}
                </div>
              ))}
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                value={loginForm.email}
                onChange={(event) => setLoginForm((current) => ({ ...current, email: event.target.value }))}
                placeholder="you@example.com"
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(event) => setLoginForm((current) => ({ ...current, password: event.target.value }))}
                placeholder="••••••••"
              />
            </div>
            <button
              type="button"
              className="btn btn-primary modal-action"
              onClick={submitLogin}
              disabled={submitting}
            >
              Sign In
            </button>
            <p className="modal-footnote">
              Don't have an account?{" "}
              <button type="button" className="link-button" onClick={onGoToRegister}>
                Sign up
              </button>
            </p>
          </>
        )}

        {modalType === "register" && (
          <>
            <h2 className="modal-title" id="modal-title">Create Account</h2>
            <p className="modal-sub">Join ServeIQ as a service provider or customer</p>
            <div className="tabs">
              {["Provider", "Customer"].map((tab) => (
                <div
                  className={`tab ${modalTab.toLowerCase() === tab.toLowerCase() ? "active" : ""}`}
                  key={tab}
                  onClick={() => setModalTab(tab.toLowerCase())}
                >
                  {tab}
                </div>
              ))}
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  value={registerForm.firstName}
                  onChange={(event) => setRegisterForm((current) => ({ ...current, firstName: event.target.value }))}
                  placeholder="Kasun"
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  value={registerForm.lastName}
                  onChange={(event) => setRegisterForm((current) => ({ ...current, lastName: event.target.value }))}
                  placeholder="Perera"
                />
              </div>
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={registerForm.email}
                onChange={(event) => setRegisterForm((current) => ({ ...current, email: event.target.value }))}
                placeholder="kasun@example.com"
              />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                value={registerForm.phoneNumber}
                onChange={(event) => setRegisterForm((current) => ({ ...current, phoneNumber: event.target.value }))}
                placeholder="+94 71 234 5678"
              />
            </div>
            {modalTab === "provider" ? (
              <div className="form-group">
                <label>Service Category</label>
                <select
                  value={registerForm.serviceCategory}
                  onChange={(event) => setRegisterForm((current) => ({ ...current, serviceCategory: event.target.value }))}
                >
                  {registerCategoryOptions.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </div>
            ) : null}
            <div className="form-group">
              <label>Years of Experience</label>
              <input
                type="number"
                min="0"
                value={registerForm.yearsOfExperience}
                onChange={(event) => setRegisterForm((current) => ({ ...current, yearsOfExperience: event.target.value }))}
                placeholder="5"
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={registerForm.password}
                onChange={(event) => setRegisterForm((current) => ({ ...current, password: event.target.value }))}
                placeholder="••••••••"
              />
            </div>
            <button
              type="button"
              className="btn btn-primary modal-action"
              onClick={submitRegister}
              disabled={submitting}
            >
              Create Account
            </button>
          </>
        )}

        {modalType === "booking" && (
          <>
            <h2 className="modal-title" id="modal-title">Book Service</h2>
            <p className="modal-sub">Fill in details to save the booking into MySQL</p>
            <div className="form-group">
              <label>Customer Name</label>
              <input
                type="text"
                value={bookingForm.customerName}
                onChange={(event) => setBookingForm((current) => ({ ...current, customerName: event.target.value }))}
                placeholder="Nimali Ratnayake"
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Customer Email</label>
                <input
                  type="email"
                  value={bookingForm.customerEmail}
                  onChange={(event) => setBookingForm((current) => ({ ...current, customerEmail: event.target.value }))}
                  placeholder="you@example.com"
                />
              </div>
              <div className="form-group">
                <label>Customer Phone</label>
                <input
                  type="tel"
                  value={bookingForm.customerPhone}
                  onChange={(event) => setBookingForm((current) => ({ ...current, customerPhone: event.target.value }))}
                  placeholder="+94 77 123 4567"
                />
              </div>
            </div>
            <div className="form-group">
              <label>Service Required</label>
              <input
                type="text"
                value={bookingForm.serviceRequired}
                onChange={(event) => setBookingForm((current) => ({ ...current, serviceRequired: event.target.value }))}
                placeholder="Electrical Repair"
              />
            </div>
            <div className="form-group">
              <label>Provider Name</label>
              <input
                type="text"
                value={bookingForm.providerName}
                onChange={(event) => setBookingForm((current) => ({ ...current, providerName: event.target.value }))}
                placeholder="Kasun Perera"
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  value={bookingForm.bookingDate}
                  onChange={(event) => setBookingForm((current) => ({ ...current, bookingDate: event.target.value }))}
                />
              </div>
              <div className="form-group">
                <label>Time</label>
                <input
                  type="time"
                  value={bookingForm.bookingTime}
                  onChange={(event) => setBookingForm((current) => ({ ...current, bookingTime: event.target.value }))}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                value={bookingForm.location}
                onChange={(event) => setBookingForm((current) => ({ ...current, location: event.target.value }))}
                placeholder="Your address"
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                rows="3"
                value={bookingForm.description}
                onChange={(event) => setBookingForm((current) => ({ ...current, description: event.target.value }))}
                placeholder="Describe the issue or work needed..."
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Service Fee</label>
                <input
                  type="number"
                  min="0"
                  value={bookingForm.serviceFee}
                  onChange={(event) => setBookingForm((current) => ({ ...current, serviceFee: event.target.value }))}
                />
              </div>
              <div className="form-group">
                <label>Call-out Fee</label>
                <input
                  type="number"
                  min="0"
                  value={bookingForm.callOutFee}
                  onChange={(event) => setBookingForm((current) => ({ ...current, callOutFee: event.target.value }))}
                />
              </div>
            </div>
            <div className="booking-summary">
              <div className="summary-row"><span>Service Fee</span><span>LKR {toNumber(bookingForm.serviceFee).toFixed(0)}</span></div>
              <div className="summary-row"><span>Call-out Fee</span><span>LKR {toNumber(bookingForm.callOutFee).toFixed(0)}</span></div>
              <div className="summary-row total"><span>Total</span><span>LKR {bookingTotal.toFixed(0)}</span></div>
            </div>
            <button
              type="button"
              className="btn btn-primary modal-action"
              onClick={submitBooking}
              disabled={submitting}
            >
              Confirm Booking & Pay
            </button>
          </>
        )}
      </div>
    </div>
  );
}
