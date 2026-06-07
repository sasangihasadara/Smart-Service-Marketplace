export default function Modal({
  modalType,
  modalTab,
  setModalTab,
  onClose,
  onOpenModal,
  onToast,
  onSignIn,
  onGoToRegister,
}) {
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
              <input type="email" placeholder="you@example.com" />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="••••••••" />
            </div>
            <button
              type="button"
              className="btn btn-primary modal-action"
              onClick={onSignIn}
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
            <p className="modal-sub">Join ServeIQ as a service provider</p>
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
              <div className="form-group"><label>First Name</label><input type="text" placeholder="Kasun" /></div>
              <div className="form-group"><label>Last Name</label><input type="text" placeholder="Perera" /></div>
            </div>
            <div className="form-group"><label>Email</label><input type="email" placeholder="kasun@example.com" /></div>
            <div className="form-group"><label>Phone Number</label><input type="tel" placeholder="+94 71 234 5678" /></div>
            <div className="form-group">
              <label>Service Category</label>
              <select defaultValue="Electrician">
                {["Electrician", "Plumber", "AC Technician", "Tutor", "Cleaner", "Photographer", "Carpenter"].map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>
            <div className="form-group"><label>Years of Experience</label><input type="number" placeholder="5" /></div>
            <div className="form-group"><label>Password</label><input type="password" placeholder="••••••••" /></div>
            <button
              type="button"
              className="btn btn-primary modal-action"
              onClick={() => {
                onClose();
                onToast("Account created! Check your email for verification.", "🎉");
              }}
            >
              Create Account
            </button>
          </>
        )}

        {modalType === "booking" && (
          <>
            <h2 className="modal-title" id="modal-title">Book Service</h2>
            <p className="modal-sub">Fill in details to confirm your booking</p>
            <div className="form-group">
              <label>Service Required</label>
              <select defaultValue="Electrical Repair">
                {["Electrical Repair", "Wiring Installation", "Solar Panel Setup"].map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Date</label><input type="date" /></div>
              <div className="form-group"><label>Time</label><input type="time" /></div>
            </div>
            <div className="form-group"><label>Location</label><input type="text" placeholder="Your address" /></div>
            <div className="form-group"><label>Description</label><textarea rows="3" placeholder="Describe the issue or work needed..." /></div>
            <div className="booking-summary">
              <div className="summary-row"><span>Service Fee (2.5 hrs)</span><span>LKR 6,250</span></div>
              <div className="summary-row"><span>Call-out Fee</span><span>LKR 1,250</span></div>
              <div className="summary-row total"><span>Total</span><span>LKR 7,500</span></div>
            </div>
            <button
              type="button"
              className="btn btn-primary modal-action"
              onClick={() => {
                onClose();
                onToast("Booking confirmed! Payment link sent to your email.", "📅");
              }}
            >
              Confirm Booking & Pay
            </button>
          </>
        )}
      </div>
    </div>
  );
}
