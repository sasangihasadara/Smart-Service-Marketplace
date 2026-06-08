import { useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import AdminMetricGrid from "../../components/admin/AdminMetricGrid";
import AdminSectionHeader from "../../components/admin/AdminSectionHeader";
import AdminStatusPill from "../../components/admin/AdminStatusPill";
import AdminTable from "../../components/admin/AdminTable";
import { getJson } from "../../api/adminApi";

function formatDateTime(value) {
  if (!value) {
    return "—";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function ProviderDashboardPage() {
  const role = localStorage.getItem("serveiq_role");
  const email = localStorage.getItem("serveiq_email");
  const [state, setState] = useState({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      setState((current) => ({ ...current, loading: true, error: null }));

      try {
        const dashboard = await getJson(`/providers/dashboard?email=${encodeURIComponent(email || "")}`);
        if (!active) {
          return;
        }

        setState({
          data: dashboard,
          loading: false,
          error: null,
        });
      } catch (requestError) {
        if (!active) {
          return;
        }

        setState({
          data: null,
          loading: false,
          error: requestError instanceof Error ? requestError.message : "Unable to load provider dashboard.",
        });
      }
    }

    if (role === "provider" && email) {
      loadDashboard();
    }

    return () => {
      active = false;
    };
  }, [email, role]);

  const provider = state.data?.provider || {};
  const summary = state.data?.summary || [];
  const bookings = Array.isArray(state.data?.bookings) ? state.data.bookings : [];
  const notifications = Array.isArray(state.data?.notifications) ? state.data.notifications : [];
  const providerStatus = String(provider.status || "pending").toLowerCase();
  const statusTone =
    providerStatus === "active" ? "success" : providerStatus === "rejected" ? "warning" : "warning";

  const bookingColumns = ["bookingCode", "serviceRequired", "customerName", "bookingDate", "bookingTime", "status", "amount"];
  const notificationColumns = ["channel", "subject", "status", "createdAt", "message"];

  const profileHighlights = useMemo(
    () => [
      { label: "Email", value: provider.email || email || "—" },
      { label: "Phone", value: provider.phoneNumber || "—" },
      { label: "Category", value: provider.category || "—" },
      { label: "Experience", value: provider.yearsOfExperience ? `${provider.yearsOfExperience} years` : "—" },
    ],
    [email, provider.category, provider.email, provider.phoneNumber, provider.yearsOfExperience],
  );

  if (role !== "provider") {
    return <Navigate to="/services" replace />;
  }

  return (
    <div className="admin-page provider-dashboard-page">
      <AdminSectionHeader
        label="Provider Console"
        title="Provider Dashboard"
        subtitle="Track your approval status, bookings, and notification history from one place."
        meta={providerStatus ? providerStatus.toUpperCase() : "PENDING"}
      />

      {state.loading ? <div className="admin-loading">Loading your provider dashboard...</div> : null}
      {state.error ? <div className="admin-banner warning">{state.error}</div> : null}

      {!state.loading && provider.name ? (
        <>
          <div className={`admin-banner ${statusTone}`}>
            {providerStatus === "active"
              ? "Your account is active and visible in the marketplace."
              : providerStatus === "rejected"
                ? `Your account was rejected. ${provider.reviewNote || "Please review the note from admin."}`
                : "Your account is waiting for admin approval."}
          </div>

          <AdminMetricGrid metrics={summary} />

          <div className="admin-panel">
            <div className="admin-panel-head">
              <div>
                <h3>Account Summary</h3>
                <p>Profile details and the latest review note from admin.</p>
              </div>
              <AdminStatusPill value={providerStatus} />
            </div>

            <div className="provider-dashboard-profile">
              {profileHighlights.map((item) => (
                <div key={item.label} className="provider-dashboard-profile-item">
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>

            <div className="provider-dashboard-notes">
              <div>
                <span>Reviewed At</span>
                <strong>{formatDateTime(provider.reviewedAt)}</strong>
              </div>
              <div>
                <span>Review Note</span>
                <strong>{provider.reviewNote || "No note yet"}</strong>
              </div>
              <div>
                <span>Price Text</span>
                <strong>{provider.priceText || "—"}</strong>
              </div>
              <div>
                <span>Source</span>
                <strong>Live backend</strong>
              </div>
            </div>
          </div>

          <div className="admin-panel admin-table-panel">
            <div className="admin-panel-head">
              <div>
                <h3>Bookings assigned to you</h3>
                <p>These are the customer requests saved against your provider name.</p>
              </div>
              <span className="admin-panel-badge">{bookings.length} total</span>
            </div>

            {bookings.length > 0 ? (
              <AdminTable
                columns={bookingColumns}
                rows={bookings}
                rowKey="bookingCode"
                renderCell={(column, row) => {
                  if (column === "status") {
                    return <AdminStatusPill value={row.status} />;
                  }

                  return row[column] || "—";
                }}
              />
            ) : (
              <div className="admin-empty-state">
                <h3>No bookings yet</h3>
                <p>Your assigned bookings will appear here after customers book your services.</p>
                <Link to="/providers" className="btn btn-primary btn-sm">
                  Browse marketplace
                </Link>
              </div>
            )}
          </div>

          <div className="admin-panel admin-table-panel">
            <div className="admin-panel-head">
              <div>
                <h3>Approval notifications</h3>
                <p>Email and SMS notification log generated when the admin reviews your account.</p>
              </div>
              <span className="admin-panel-badge">{notifications.length} messages</span>
            </div>

            {notifications.length > 0 ? (
              <AdminTable
                columns={notificationColumns}
                rows={notifications}
                rowKey="id"
                renderCell={(column, row) => {
                  if (column === "status") {
                    return <AdminStatusPill value={row.status} />;
                  }

                  if (column === "message") {
                    return <span className="provider-notification-message">{row.message}</span>;
                  }

                  if (column === "createdAt") {
                    return formatDateTime(row.createdAt);
                  }

                  return row[column] || "—";
                }}
              />
            ) : (
              <div className="admin-empty-state">
                <h3>No notifications yet</h3>
                <p>Once your account is reviewed, approval messages will show here.</p>
              </div>
            )}
          </div>
        </>
      ) : null}

      {!state.loading && !provider.name && !state.error ? (
        <div className="admin-empty-state">
          <h3>No provider profile found</h3>
          <p>We could not load a provider account for {email || "this session"}.</p>
        </div>
      ) : null}
    </div>
  );
}
