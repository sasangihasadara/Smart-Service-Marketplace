import AdminMetricGrid from "../../components/admin/AdminMetricGrid";
import AdminSectionHeader from "../../components/admin/AdminSectionHeader";
import AdminStatusPill from "../../components/admin/AdminStatusPill";
import { adminFallbackData } from "../../data/adminFallbackData";
import { useAdminResource } from "../../hooks/useAdminResource";

export default function AdminFraudPage() {
  const { data, loading, error, source } = useAdminResource("/fraud", adminFallbackData.fraud);

  return (
    <div className="admin-page">
      <AdminSectionHeader
        label="Fraud"
        title="Fraud Monitoring"
        subtitle="Watch anomaly scores, escalations, and review confidence in real time."
        meta={source === "api" ? "Synced from backend API" : "Showing offline fallback data"}
      />

      {error ? <div className="admin-banner warning">Backend unavailable. Using fallback data.</div> : null}
      {loading ? <div className="admin-loading">Loading fraud records...</div> : null}

      <AdminMetricGrid metrics={data.summary} />

      <div className="admin-alert-list">
        {data.alerts.map((alert) => (
          <article className={`admin-alert ${alert.severity}`} key={`${alert.title}-${alert.score}`}>
            <div>
              <h3>{alert.title}</h3>
              <p>{alert.description}</p>
            </div>
            <div className="admin-alert-side">
              <AdminStatusPill value={alert.severity} />
              <strong>{alert.score}</strong>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
