import { useState } from "react";
import AdminMetricGrid from "../../components/admin/AdminMetricGrid";
import AdminSectionHeader from "../../components/admin/AdminSectionHeader";
import AdminStatusPill from "../../components/admin/AdminStatusPill";
import AdminTable from "../../components/admin/AdminTable";
import { postAdminResource } from "../../api/adminApi";
import { adminFallbackData } from "../../data/adminFallbackData";
import { useAdminResource } from "../../hooks/useAdminResource";

export default function AdminUsersPage() {
  const [adminForm, setAdminForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [adminMessage, setAdminMessage] = useState(null);
  const [adminMessageTone, setAdminMessageTone] = useState("success");

  const { data, loading, error, source } = useAdminResource("/users", adminFallbackData.users, refreshKey);

  const createAdmin = async () => {
    setSubmitting(true);
    setAdminMessage(null);

    try {
      const result = await postAdminResource("/internal/admins", adminForm);
      setAdminMessage(result.message || "Admin account created.");
      setAdminMessageTone("success");
      setAdminForm({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        password: "",
      });
      setRefreshKey((current) => current + 1);
    } catch (requestError) {
      setAdminMessageTone("warning");
      setAdminMessage(requestError instanceof Error ? requestError.message : "Unable to create admin account.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-page">
      <AdminSectionHeader
        label="Users"
        title="User Management"
        subtitle="Review customers, providers, and account health from one place."
        meta={source === "api" ? "Synced from backend API" : "Showing offline fallback data"}
        dark
      />

      {error ? <div className="admin-banner warning">Backend unavailable. Using fallback data.</div> : null}
      {loading ? <div className="admin-loading">Loading user records...</div> : null}

      <AdminMetricGrid metrics={data.summary} />

      <div className="admin-panel">
        <div className="admin-panel-head">
          <div>
            <h3>Internal Admin Setup</h3>
            <p>Hidden setup tool for creating additional admin accounts from inside the console.</p>
          </div>
          <span className="admin-panel-badge">Internal only</span>
        </div>

        <div className="admin-banner success" style={{ marginBottom: "1rem" }}>
          Demo admin seed is always available as <strong>admin@serveiq.com</strong>. Use this panel only for internal setup when you need another admin.
        </div>

        <div className="auth-form admin-internal-form">
          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                value={adminForm.firstName}
                onChange={(event) => setAdminForm((current) => ({ ...current, firstName: event.target.value }))}
                placeholder="Serve"
              />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                value={adminForm.lastName}
                onChange={(event) => setAdminForm((current) => ({ ...current, lastName: event.target.value }))}
                placeholder="Admin"
              />
            </div>
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={adminForm.email}
              onChange={(event) => setAdminForm((current) => ({ ...current, email: event.target.value }))}
              placeholder="new-admin@serveiq.com"
            />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              value={adminForm.phoneNumber}
              onChange={(event) => setAdminForm((current) => ({ ...current, phoneNumber: event.target.value }))}
              placeholder="0700000000"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={adminForm.password}
              onChange={(event) => setAdminForm((current) => ({ ...current, password: event.target.value }))}
              placeholder="••••••••"
            />
          </div>
          <button type="button" className="btn btn-primary" onClick={createAdmin} disabled={submitting}>
            {submitting ? "Creating admin..." : "Create Admin"}
          </button>
          {adminMessage ? <div className={`admin-banner ${adminMessageTone}`} style={{ marginTop: "0.75rem" }}>{adminMessage}</div> : null}
        </div>
      </div>

      <div className="admin-panel">
        <AdminTable
          columns={["id", "name", "role", "location", "status", "tier"]}
          rows={data.users}
          rowKey="id"
          renderCell={(column, row) => {
            if (column === "status" || column === "tier") {
              return <AdminStatusPill value={row[column]} />;
            }

            return row[column];
          }}
        />
      </div>
    </div>
  );
}
