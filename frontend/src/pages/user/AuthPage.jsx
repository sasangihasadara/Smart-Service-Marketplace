import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import GoogleSignInButton from "../../components/GoogleSignInButton";

const registerRoles = [
  { key: "customer", label: "Customer", hint: "Book fast, pay securely, leave reviews." },
  { key: "provider", label: "Provider", hint: "Create a professional service profile." },
];

const providerCategories = [
  "Electrician",
  "Plumber",
  "AC Technician",
  "Tutor",
  "Cleaner",
  "Photographer",
  "Carpenter",
];

function getRegisterRoleConfig(role) {
  return registerRoles.find((item) => item.key === role) || registerRoles[1];
}

function buildNote(mode, role, notice) {
  if (mode === "register" && role === "provider") {
    return "Provider accounts are created as pending and become visible only after admin approval.";
  }

  if (mode === "login" && notice === "pending") {
    return "Your provider account is waiting for admin approval. You can sign in, but the dashboard remains locked until approval.";
  }

  if (mode === "login") {
    return "Sign in with your email and password. The system will auto-detect whether you are a customer, provider, or admin.";
  }

  return "Choose the account type that matches how you will use ServeIQ.";
}

export default function AuthPage({ initialMode = "login", initialRole = "customer", onSignIn, onGoogleSignIn, onRegister, onToast }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const mode = searchParams.get("mode") || initialMode;
  const notice = searchParams.get("notice") || "";
  const registerRoleParam = searchParams.get("role") || initialRole;
  const registerRole = useMemo(
    () => (mode === "register" ? getRegisterRoleConfig(registerRoleParam).key : "provider"),
    [mode, registerRoleParam]
  );
  const selectedRegisterRole = getRegisterRoleConfig(registerRole);

  const [loginForm, setLoginForm] = useState({ email: "", password: "", rememberMe: true });
  const [registerForm, setRegisterForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    serviceCategory: "Electrician",
    yearsOfExperience: 1,
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const roleNote = buildNote(mode, registerRole, notice);
  const pendingProvider = mode === "login" && notice === "pending";

  const heroBullets = useMemo(
    () =>
      mode === "register"
        ? [
            "Customer accounts stay simple and quick.",
            "Provider accounts are reviewed before activation.",
            "One auth system powers all three roles.",
          ]
        : [
            "No role selection is needed at login.",
            "The system detects customer, provider, or admin automatically.",
            "Pending provider accounts stay blocked until approval.",
          ],
    [mode]
  );

  const updateMode = (nextMode, nextRole = null, nextNotice = "") => {
    const params = new URLSearchParams();
    params.set("mode", nextMode);

    if (nextMode === "register") {
      params.set("role", nextRole || "provider");
    }

    if (nextMode === "login" && nextNotice) {
      params.set("notice", nextNotice);
      if (nextRole) {
        params.set("role", nextRole);
      }
    }

    setSearchParams(params);
  };

  const submitLogin = async (event) => {
    event.preventDefault();

    const email = loginForm.email.trim();
    const password = loginForm.password.trim();

    if (!email || !password) {
      onToast?.("Please enter both email and password.");
      return;
    }

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValidEmail) {
      onToast?.("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);

    try {
      await onSignIn?.({ ...loginForm, email, password });
      if (loginForm.rememberMe) {
        localStorage.setItem("serveiq_remember_me", "true");
      } else {
        localStorage.removeItem("serveiq_remember_me");
      }
    } catch (error) {
      onToast?.(error?.message || "Login failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const submitRegister = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      await onRegister?.({
        ...registerForm,
        role: registerRole,
        serviceCategory: registerRole === "provider" ? registerForm.serviceCategory : "Customer",
        yearsOfExperience: registerRole === "provider" ? Number(registerForm.yearsOfExperience) || 0 : 0,
      });
    } catch (error) {
      onToast?.(error?.message || "Registration failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleCredential = async (credential) => {
    setSubmitting(true);

    try {
      await onGoogleSignIn?.(credential);
    } catch (error) {
      onToast?.(error?.message || "Google sign-in failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <section className="auth-shell">
        <div className="container">
          <div className="auth-layout">
            <div className="auth-hero fade-up">
              <div className="auth-kicker">
                <span className="auth-kicker-dot" />
                Role-based authentication
              </div>
              <h1>
                One secure sign-in for <em>customers</em>, <em>providers</em>, and <em>admins</em>.
              </h1>
              <p className="auth-hero-copy">
                ServeIQ keeps authentication simple on the surface and strict underneath. The same login system routes each user to the right workspace with role and approval checks.
              </p>

              <div className="auth-bullet-list">
                {heroBullets.map((item) => (
                  <div key={item} className="auth-bullet">
                    <span>OK</span>
                    <p>{item}</p>
                  </div>
                ))}
              </div>

              <div className="auth-side-card">
                <div className="auth-side-card-head">
                  <span>{mode === "register" ? "Register flow" : "Login flow"}</span>
                  <Link
                    to={mode === "register" ? "/login?mode=login" : "/register?mode=register&role=provider"}
                    className="auth-side-link"
                  >
                    {mode === "register" ? "Already have an account?" : "Need an account?"}
                  </Link>
                </div>
                <p>{roleNote}</p>
                <div className="auth-mini-grid">
                  <div>
                    <strong>Admin</strong>
                    <span>Internal access only</span>
                  </div>
                  <div>
                    <strong>Customer</strong>
                    <span>Book and pay online</span>
                  </div>
                  <div>
                    <strong>Provider</strong>
                    <span>Needs approval</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="auth-panel fade-up">
              <div className="auth-panel-top">
                <div>
                  <div className="auth-panel-label">ServeIQ Access</div>
                  <h2>{mode === "register" ? "Create your account" : "Sign in to continue"}</h2>
                </div>
                <div className={`auth-status-pill ${pendingProvider ? "pending" : ""}`}>
                  {mode === "register" ? selectedRegisterRole.label : pendingProvider ? "Pending approval" : "Auto detect"}
                </div>
              </div>

              <div className="auth-switch">
                <button type="button" className={`auth-switch-tab ${mode === "login" ? "active" : ""}`} onClick={() => updateMode("login")}>
                  Login
                </button>
                <button
                  type="button"
                  className={`auth-switch-tab ${mode === "register" ? "active" : ""}`}
                  onClick={() => updateMode("register", "provider")}
                >
                  Register
                </button>
              </div>

              {mode === "register" ? (
                <div className="auth-role-tabs">
                  {registerRoles.map((item) => (
                    <button
                      type="button"
                      key={item.key}
                      className={`auth-role-tab ${registerRole === item.key ? "active" : ""}`}
                      onClick={() => updateMode("register", item.key)}
                    >
                      <strong>{item.label}</strong>
                      <span>{item.hint}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="auth-banner success">{roleNote}</div>
              )}

              {pendingProvider ? <div className="auth-banner pending">{roleNote}</div> : null}

              {mode === "login" ? (
                <form className="auth-form" onSubmit={submitLogin}>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      value={loginForm.email}
                      onChange={(event) => setLoginForm((current) => ({ ...current, email: event.target.value }))}
                      placeholder="you@example.com"
                      autoComplete="email"
                    />
                  </div>

                  <div className="form-group">
                    <label>Password</label>
                    <div className="password-field">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={loginForm.password}
                        onChange={(event) => setLoginForm((current) => ({ ...current, password: event.target.value }))}
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

                  <div className="auth-meta-row">
                    <label className="remember-me">
                      <input
                        type="checkbox"
                        checked={loginForm.rememberMe}
                        onChange={(event) => setLoginForm((current) => ({ ...current, rememberMe: event.target.checked }))}
                      />
                      <span>Remember me</span>
                    </label>
                    <button
                      type="button"
                      className="link-button auth-forgot-link"
                      onClick={() => onToast?.("Password reset is available in a production auth setup.")}
                    >
                      Forgot password?
                    </button>
                  </div>

                  <div className="auth-role-summary">
                    <span>Role detection</span>
                    <strong>Automatic after sign in</strong>
                  </div>

                  <button type="submit" className="btn btn-primary modal-action auth-submit" disabled={submitting}>
                    {submitting ? "Signing in..." : "Sign in"}
                  </button>

                  <div className="auth-divider"><span>or</span></div>
                  <GoogleSignInButton onCredential={handleGoogleCredential} disabled={submitting} />
                  <p className="auth-google-note">New Google accounts are created as customer accounts. Providers can link Google after completing their service profile.</p>
                </form>
              ) : (
                <form className="auth-form" onSubmit={submitRegister}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>First Name</label>
                      <input
                        type="text"
                        value={registerForm.firstName}
                        onChange={(event) => setRegisterForm((current) => ({ ...current, firstName: event.target.value }))}
                        placeholder="Kasun"
                        autoComplete="given-name"
                      />
                    </div>
                    <div className="form-group">
                      <label>Last Name</label>
                      <input
                        type="text"
                        value={registerForm.lastName}
                        onChange={(event) => setRegisterForm((current) => ({ ...current, lastName: event.target.value }))}
                        placeholder="Perera"
                        autoComplete="family-name"
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
                      autoComplete="email"
                    />
                  </div>

                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      value={registerForm.phoneNumber}
                      onChange={(event) => setRegisterForm((current) => ({ ...current, phoneNumber: event.target.value }))}
                      placeholder="+94 71 234 5678"
                      autoComplete="tel"
                    />
                  </div>

                  {registerRole === "provider" ? (
                    <>
                      <div className="form-group">
                        <label>Service Category</label>
                        <select
                          value={registerForm.serviceCategory}
                          onChange={(event) => setRegisterForm((current) => ({ ...current, serviceCategory: event.target.value }))}
                        >
                          {providerCategories.map((option) => (
                            <option key={option}>{option}</option>
                          ))}
                        </select>
                      </div>
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
                      <div className="auth-banner pending">
                        Provider accounts enter the system as pending. Admin approval is required before the dashboard becomes active.
                      </div>
                    </>
                  ) : (
                    <div className="auth-banner success">
                      Customer accounts are active immediately and can start booking services right away.
                    </div>
                  )}

                  <div className="form-group">
                    <label>Password</label>
                    <input
                      type="password"
                      value={registerForm.password}
                      onChange={(event) => setRegisterForm((current) => ({ ...current, password: event.target.value }))}
                      placeholder="••••••••"
                      autoComplete="new-password"
                    />
                  </div>

                  <div className="auth-role-summary">
                    <span>Account type</span>
                    <strong>{selectedRegisterRole.label}</strong>
                  </div>

                  <button type="submit" className="btn btn-primary modal-action auth-submit" disabled={submitting}>
                    {submitting ? "Creating account..." : `Create ${selectedRegisterRole.label} account`}
                  </button>
                </form>
              )}

              <div className="auth-footnote">
                {mode === "login" ? (
                  <>
                    No account yet?{" "}
                    <button type="button" className="link-button" onClick={() => updateMode("register", "provider")}>
                      Create one
                    </button>
                  </>
                ) : (
                  <>
                    Already registered?{" "}
                    <button type="button" className="link-button" onClick={() => updateMode("login")}>
                      Sign in
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
