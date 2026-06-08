import AdminMetricGrid from "../../components/admin/AdminMetricGrid";
import AdminSectionHeader from "../../components/admin/AdminSectionHeader";
import AdminStatusPill from "../../components/admin/AdminStatusPill";
import { adminFallbackData } from "../../data/adminFallbackData";
import { useAdminResource } from "../../hooks/useAdminResource";

export default function AdminProvidersPage() {
  const { data, loading, error, source } = useAdminResource("/providers", adminFallbackData.providers);

  return (
    <div className="admin-page">
      <AdminSectionHeader
        label="Providers"
        title="Provider Approval Queue"
        subtitle="Verify quality, ratings, and onboarding status for service providers."
        meta={source === "api" ? "Synced from backend API" : "Showing offline fallback data"}
      />

      {error ? <div className="admin-banner warning">Backend unavailable. Using fallback data.</div> : null}
      {loading ? <div className="admin-loading">Loading provider records...</div> : null}

      <AdminMetricGrid metrics={data.summary} />

      <div className="admin-card-grid">
        {data.providers.map((provider) => (
          <article className="admin-card" key={provider.name}>
            <div className="admin-card-top">
              <div>
                <h3>{provider.name}</h3>
                <p>{provider.category}</p>
              </div>
              <AdminStatusPill value={provider.status} />
            </div>
            <div className="admin-card-stats">
              <div>
                <span>Rating</span>
                <strong>{provider.rating}</strong>
              </div>
              <div>
                <span>Jobs</span>
                <strong>{provider.jobs}</strong>
              </div>
              <div>
                <span>Completion</span>
                <strong>{provider.completionRate}</strong>
              </div>
            </div>
            <div className="admin-card-footer">
              <span>{provider.price}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
