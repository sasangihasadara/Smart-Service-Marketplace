import AdminMetricGrid from "../../components/admin/AdminMetricGrid";
import AdminSectionHeader from "../../components/admin/AdminSectionHeader";
import AdminStatusPill from "../../components/admin/AdminStatusPill";
import AdminTable from "../../components/admin/AdminTable";
import { adminFallbackData } from "../../data/adminFallbackData";
import { useAdminResource } from "../../hooks/useAdminResource";

function formatGeneratedAt(value) {
  if (!value || value === "offline") {
    return "Offline fallback snapshot";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function AdminDashboardPage() {
  const { data, loading, error, source } = useAdminResource("/overview", adminFallbackData.overview);

  const metrics = data.metrics || [];
  const chart = data.chart || adminFallbackData.overview.chart;
  const chartLabels = chart.labels || [];
  const chartValues = chart.values || [];
  const chartMax = Math.max(...chartValues, 1);
  const recentBookings = data.recentBookings || [];
  const activity = data.activity || [];
  const generatedAt = formatGeneratedAt(data.generatedAt);

  return (
    <div className="admin-page admin-dashboard-page">
      <div className="admin-dashboard-hero">
        <div className="admin-dashboard-hero-copy">
          <AdminSectionHeader
            label="Admin Analytics"
            title="Command center for the entire marketplace"
            subtitle="Track revenue, bookings, user growth, provider approvals, and fraud pressure from one calm view."
            meta={source === "api" ? "Synced from MySQL API" : "Showing offline fallback data"}
          />

          <div className="admin-hero-pills">
            <span className="admin-hero-pill">
              {source === "api" ? "Live database sync" : "Offline preview"}
            </span>
            <span className="admin-hero-pill">Updated {generatedAt}</span>
          </div>
        </div>

        <aside className="admin-hero-card">
          <div className="admin-hero-card-head">
            <span>System pulse</span>
            <AdminStatusPill value={source === "api" ? "Active" : "Pending"} />
          </div>
          <div className="admin-hero-metrics">
            <div>
              <strong>{metrics[0]?.value || "LKR 0"}</strong>
              <span>Revenue</span>
            </div>
            <div>
              <strong>{metrics[1]?.value || "0"}</strong>
              <span>Bookings</span>
            </div>
            <div>
              <strong>{metrics[2]?.value || "0"}</strong>
              <span>Active users</span>
            </div>
          </div>
          <p className="admin-hero-note">
            {source === "api"
              ? "Data is flowing from the backend API and MySQL."
              : "The UI is using fallback records while the backend refreshes."}
          </p>
        </aside>
      </div>

      {error ? <div className="admin-banner warning">Backend unavailable. Showing fallback data.</div> : null}
      {loading ? <div className="admin-loading">Loading live overview...</div> : null}

      <AdminMetricGrid metrics={metrics} />

      <div className="admin-dashboard-grid">
        <article className="admin-panel admin-chart-panel">
          <div className="admin-panel-head">
            <div>
              <h3>Monthly bookings trend</h3>
              <p>Overview of booking volume across the year.</p>
            </div>
            <span className="admin-panel-badge">{chart.series || "Monthly bookings"}</span>
          </div>

          <div className="dashboard-chart">
            {chartLabels.map((label, index) => {
              const value = chartValues[index] || 0;
              const height = chartMax > 0 ? Math.max((value / chartMax) * 100, 10) : 10;

              return (
                <div className="dashboard-chart-column" key={label}>
                  <div
                    className="dashboard-chart-bar"
                    style={{
                      height: `${height}%`,
                    }}
                    title={`${label}: ${value}`}
                  />
                  <span>{label}</span>
                </div>
              );
            })}
          </div>
        </article>

        <aside className="admin-panel admin-activity-panel">
          <div className="admin-panel-head">
            <div>
              <h3>Live activity</h3>
              <p>Useful signals to review before opening records.</p>
            </div>
          </div>

          <div className="admin-activity-list">
            {activity.map((item) => (
              <div className="admin-activity-item" key={item}>
                <span className="admin-activity-dot" />
                <p>{item}</p>
              </div>
            ))}
          </div>

          <div className="admin-mini-grid">
            <div className="admin-mini-card">
              <span>Source</span>
              <strong>{source === "api" ? "MySQL API" : "Fallback data"}</strong>
            </div>
            <div className="admin-mini-card">
              <span>Recent bookings</span>
              <strong>{recentBookings.length}</strong>
            </div>
          </div>
        </aside>
      </div>

      <div className="admin-panel admin-table-panel">
        <div className="admin-panel-head">
          <div>
            <h3>Recent bookings</h3>
            <p>Latest records pulled from the bookings table.</p>
          </div>
        </div>
        <AdminTable
          columns={["id", "customer", "service", "provider", "amount", "status"]}
          rows={recentBookings}
          rowKey="id"
          renderCell={(column, row) => {
            if (column === "status") {
              return <AdminStatusPill value={row.status} />;
            }

            return row[column];
          }}
        />
      </div>
    </div>
  );
}
