import { useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { getJson } from "../../api/adminApi";

function formatDateTime(value) {
  if (!value) return "Not reviewed yet";

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;

  return parsed.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

function formatStatus(value) {
  const text = String(value || "pending");
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

function getInitials(name) {
  return String(name || "ServeIQ Provider")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function statusMessage(status, note) {
  if (status === "active") return "Your profile is live and ready to receive customer requests.";
  if (status === "rejected") return note || "Your profile needs an update before it can be listed.";
  if (status === "suspended") return "Your marketplace listing is currently paused. Contact support for help.";
  return "Your profile is being reviewed. We will notify you as soon as it is approved.";
}

export default function ProviderDashboardPage() {
  const role = localStorage.getItem("serveiq_role");
  const email = localStorage.getItem("serveiq_email");
  const [state, setState] = useState({ data: null, loading: true, error: null });

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      try {
        const dashboard = await getJson(`/providers/dashboard?email=${encodeURIComponent(email || "")}`);
        if (active) setState({ data: dashboard, loading: false, error: null });
      } catch (requestError) {
        if (active) {
          setState({
            data: null,
            loading: false,
            error: requestError instanceof Error ? requestError.message : "Unable to load your provider dashboard.",
          });
        }
      }
    }

    if (role === "provider" && email) loadDashboard();
    return () => { active = false; };
  }, [email, role]);

  const provider = state.data?.provider || {};
  const stats = state.data?.stats || {};
  const bookings = Array.isArray(state.data?.bookings) ? state.data.bookings : [];
  const notifications = Array.isArray(state.data?.notifications) ? state.data.notifications : [];
  const providerStatus = String(provider.status || stats.providerStatus || "pending").toLowerCase();

  const profileHighlights = useMemo(() => [
    { label: "Email", value: provider.email || email || "Not available" },
    { label: "Phone", value: provider.phoneNumber || "Add your phone number" },
    { label: "Service category", value: provider.category || "Not selected" },
    { label: "Experience", value: provider.yearsOfExperience ? `${provider.yearsOfExperience} years` : "Not added" },
  ], [email, provider.category, provider.email, provider.phoneNumber, provider.yearsOfExperience]);

  const profileCompletion = [provider.name, provider.email || email, provider.phoneNumber, provider.category, provider.yearsOfExperience, provider.priceText]
    .filter(Boolean).length;
  const profileCompletionPercent = Math.round((profileCompletion / 6) * 100);

  if (role !== "provider") return <Navigate to="/services" replace />;

  if (state.loading) {
    return (
      <main className="provider-workspace provider-workspace--loading">
        <div className="provider-loading-card"><span className="provider-loader" /> Loading your workspace...</div>
      </main>
    );
  }

  if (state.error || !provider.name) {
    return (
      <main className="provider-workspace provider-workspace--loading">
        <div className="provider-error-card">
          <span>!</span>
          <h1>We could not load your workspace</h1>
          <p>{state.error || `No provider profile was found for ${email || "this session"}.`}</p>
          <Link to="/providers" className="btn btn-primary">Browse marketplace</Link>
        </div>
      </main>
    );
  }

  const metrics = [
    { label: "Account status", value: formatStatus(providerStatus), detail: providerStatus === "active" ? "Visible in marketplace" : "Profile review in progress", icon: "✓", tone: providerStatus },
    { label: "Total bookings", value: stats.totalBookings ?? bookings.length, detail: `${stats.pendingBookings ?? 0} waiting for action`, icon: "◫" },
    { label: "Jobs completed", value: stats.completedBookings ?? 0, detail: "Successful deliveries", icon: "↗" },
    { label: "Earnings", value: `LKR ${Number(stats.earnings || 0).toLocaleString("en-US")}`, detail: "Confirmed and completed jobs", icon: "◈" },
  ];

  const focusCards = [
    { label: "Profile completeness", value: `${profileCompletionPercent}%`, hint: profileCompletionPercent === 100 ? "Ready for more customers" : "Complete your public profile", tone: "accent" },
    { label: "Today’s focus", value: bookings.length ? "Review requests" : "Build visibility", hint: bookings.length ? `${stats.pendingBookings ?? 0} requests waiting for action` : "Keep your listing complete", tone: "success" },
    { label: "Lifetime earnings", value: `LKR ${Number(stats.earnings || 0).toLocaleString("en-US")}`, hint: "Confirmed and completed work", tone: "neutral" },
  ];

  return (
    <main className="provider-workspace">
      <section className="provider-hero-panel">
        <div className="provider-hero-content">
          <div className="provider-avatar-large">{getInitials(provider.name)}</div>
          <div className="provider-hero-copy">
            <div className="provider-kicker">Provider workspace</div>
            <h1>Welcome back, {provider.name.split(" ")[0]}</h1>
            <p>{provider.category || "Service professional"} · {provider.yearsOfExperience || 0} years of experience</p>
          </div>
        </div>
        <div className="provider-hero-actions">
          <span className={`provider-status-chip ${providerStatus}`}><i /> {formatStatus(providerStatus)}</span>
          <Link to="/providers" className="btn btn-ghost">View marketplace</Link>
        </div>
      </section>

      <section className={`provider-status-banner ${providerStatus}`}>
        <div className="provider-status-icon">{providerStatus === "active" ? "✓" : "i"}</div>
        <div>
          <strong>{providerStatus === "active" ? "Your profile is live" : `Account ${formatStatus(providerStatus)}`}</strong>
          <p>{statusMessage(providerStatus, provider.reviewNote)}</p>
        </div>
        <span>Last reviewed: {formatDateTime(provider.reviewedAt)}</span>
      </section>

      <section className="provider-focus-grid" aria-label="Provider quick summary">
        {focusCards.map((card) => (
          <article className={`provider-focus-card ${card.tone}`} key={card.label}>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
            <small>{card.hint}</small>
          </article>
        ))}
      </section>

      <section className="provider-metric-grid" aria-label="Provider account overview">
        {metrics.map((metric) => (
          <article className={`provider-metric-card ${metric.tone || ""}`} key={metric.label}>
            <span className="provider-metric-icon">{metric.icon}</span>
            <span className="provider-metric-label">{metric.label}</span>
            <strong>{metric.value}</strong>
            <p>{metric.detail}</p>
          </article>
        ))}
      </section>

      <section className="provider-content-grid">
        <article className="provider-panel provider-bookings-panel">
          <div className="provider-panel-head">
            <div>
              <span className="provider-kicker">Your work</span>
              <h2>Upcoming bookings</h2>
            </div>
            <span className="provider-count-badge">{bookings.length} total</span>
          </div>

          {bookings.length ? (
            <div className="provider-booking-list">
              {bookings.slice(0, 4).map((booking) => (
                <div className="provider-booking-row" key={booking.bookingCode}>
                  <div className="provider-booking-date"><strong>{booking.bookingDate || "TBD"}</strong><span>{booking.bookingTime || "Time to confirm"}</span></div>
                  <div className="provider-booking-copy"><strong>{booking.serviceRequired || "Service request"}</strong><span>{booking.customerName || "Customer"} · {booking.location || "Location to confirm"}</span></div>
                  <span className="provider-booking-amount">{booking.amount || "LKR 0"}</span>
                  <span className={`provider-row-status ${String(booking.status || "pending").toLowerCase()}`}>{formatStatus(booking.status)}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="provider-empty-bookings">
              <div className="provider-empty-illustration">⌁</div>
              <h3>Your booking calendar is clear</h3>
              <p>When customers select your service, their requests will appear here with all the details you need.</p>
              <Link to="/providers" className="btn btn-primary btn-sm">See your public listing</Link>
            </div>
          )}
        </article>

        <article className="provider-panel provider-profile-panel">
          <div className="provider-panel-head">
            <div>
              <span className="provider-kicker">Your profile</span>
              <h2>Account details</h2>
            </div>
            <span className="provider-profile-rating">★ {provider.rating || "New"}</span>
          </div>
          <dl className="provider-profile-list">
            {profileHighlights.map((item) => (
              <div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>
            ))}
          </dl>
          <div className="provider-review-note">
            <span>Admin review note</span>
            <p>{provider.reviewNote || "Your profile has not received a review note yet."}</p>
          </div>
        </article>
      </section>

      <section className="provider-panel provider-notifications-panel">
        <div className="provider-panel-head">
          <div>
            <span className="provider-kicker">Updates</span>
            <h2>Notifications</h2>
          </div>
          <span className="provider-count-badge">{notifications.length} messages</span>
        </div>
        {notifications.length ? (
          <div className="provider-notification-list">
            {notifications.slice(0, 3).map((notification) => (
              <div className="provider-notification-item" key={notification.id}>
                <span className="provider-notification-dot" />
                <div><strong>{notification.subject || "Account update"}</strong><p>{notification.message || "You have a new notification."}</p></div>
                <time>{formatDateTime(notification.createdAt)}</time>
              </div>
            ))}
          </div>
        ) : <p className="provider-empty-message">You are all caught up. Important account and booking updates will appear here.</p>}
      </section>
    </main>
  );
}
