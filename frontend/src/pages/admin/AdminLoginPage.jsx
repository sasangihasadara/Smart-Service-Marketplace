import { useState } from "react";
import { Link } from "react-router-dom";

export default function AdminLoginPage({ onSignIn, onToast }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const submitLogin = async (event) => {
    event.preventDefault();

    const email = form.email.trim();
    const password = form.password.trim();

    if (!email || !password) {
      onToast?.("Please enter both email and password.");
      return;
    }

    setSubmitting(true);

    try {
      await onSignIn?.({ email, password, role: "admin" });
    } catch (error) {
      onToast?.(error?.message || "Admin login failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="auth-shell admin-login-shell">
      <div className="container">
        <div className="auth-layout admin-login-layout">
          <div className="admin-login-intro fade-up">
            <span className="admin-login-eyebrow">ServeIQ control centre</span>
            <h1>Keep the marketplace moving.</h1>
            <p>Review providers, monitor bookings, and protect the quality of every service request from one private workspace.</p>
            <div className="admin-login-checklist">
              <span><b>01</b> Private administrator access</span>
              <span><b>02</b> Provider approvals and reviews</span>
              <span><b>03</b> Booking and fraud visibility</span>
            </div>
          </div>

          <div className="auth-panel admin-login-panel fade-up">
            <div className="auth-panel-top">
              <div>
                <div className="auth-panel-label">Private access</div>
                <h2>Admin sign in</h2>
              </div>
              <div className="auth-status-pill">Admin</div>
            </div>

            <form className="auth-form" onSubmit={submitLogin}>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                  placeholder="admin@serveiq.com"
                  autoComplete="email"
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <div className="password-field">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn btn-primary modal-action auth-submit" disabled={submitting}>
                {submitting ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <div className="auth-footnote">
              <Link to="/login" className="link-button">
                Back to public login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
