import { useState } from "react";

import { postAdminResource } from "../../api/adminApi";
import AdminMetricGrid from "../../components/admin/AdminMetricGrid";
import AdminSectionHeader from "../../components/admin/AdminSectionHeader";
import AdminStatusPill from "../../components/admin/AdminStatusPill";
import { adminFallbackData } from "../../data/adminFallbackData";
import { useAdminResource } from "../../hooks/useAdminResource";

const APPROVE_NOTE = "Verified documents and approved for marketplace access.";
const REJECT_NOTE = "Rejected after manual review of the provider application.";

function isPendingProvider(provider) {
  return String(provider?.status || "").toLowerCase() === "pending";
}

function formatReviewMeta(provider) {
  if (!provider.reviewedAt) {
    return null;
  }

  const reviewedAt = new Date(provider.reviewedAt);
  if (Number.isNaN(reviewedAt.getTime())) {
    return provider.reviewedAt;
  }

  return reviewedAt.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function AdminProvidersPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [actionState, setActionState] = useState({
    providerId: null,
    action: null,
    message: null,
    error: null,
  });
  const { data, loading, error, source } = useAdminResource("/providers", adminFallbackData.providers, refreshKey);

  const providers = Array.isArray(data.providers) ? data.providers : [];
  const pendingProviders = providers.filter(isPendingProvider);
  const reviewedProviders = providers.filter((provider) => !isPendingProvider(provider));
  const isLive = source === "api";

  async function handleDecision(provider, action) {
    if (!isLive) {
      return;
    }

    setActionState({
      providerId: provider.id,
      action,
      message: null,
      error: null,
    });

    try {
      const response = await postAdminResource(`/providers/${provider.id}/${action}`, {
        note: action === "approve" ? APPROVE_NOTE : REJECT_NOTE,
      });

      setRefreshKey((value) => value + 1);
      setActionState({
        providerId: null,
        action: null,
        message: response.message || `Provider ${action}d successfully.`,
        error: null,
      });
    } catch (requestError) {
      setActionState({
        providerId: null,
        action: null,
        message: null,
        error: requestError instanceof Error ? requestError.message : "Unable to update provider status.",
      });
    }
  }

  return (
    <div className="admin-page">
      <AdminSectionHeader
        label="Providers"
        title="Provider Approval Queue"
        subtitle="Verify quality, ratings, and onboarding status for service providers."
        meta={source === "api" ? "Synced from backend API" : "Showing offline fallback data"}
        dark
      />

      {error ? <div className="admin-banner warning">Backend unavailable. Using fallback data.</div> : null}
      {actionState.message ? <div className="admin-banner success">{actionState.message}</div> : null}
      {actionState.error ? <div className="admin-banner warning">{actionState.error}</div> : null}
      {loading ? <div className="admin-loading">Loading provider records...</div> : null}

      <AdminMetricGrid metrics={data.summary} />

      <div className="admin-panel">
        <div className="admin-panel-head">
          <div>
            <h3>Pending review</h3>
            <p>These providers need a manual approval decision before they can go live.</p>
          </div>
          <span className="admin-panel-badge">{pendingProviders.length} waiting</span>
        </div>

        <div className="admin-card-grid">
          {pendingProviders.map((provider) => (
            <article className="admin-card" key={provider.id}>
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
                <div className="admin-card-actions">
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    disabled={!isLive || actionState.providerId === provider.id}
                    onClick={() => handleDecision(provider, "approve")}
                  >
                    {actionState.providerId === provider.id && actionState.action === "approve"
                      ? "Approving..."
                      : "Approve"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    disabled={!isLive || actionState.providerId === provider.id}
                    onClick={() => handleDecision(provider, "reject")}
                  >
                    {actionState.providerId === provider.id && actionState.action === "reject"
                      ? "Rejecting..."
                      : "Reject"}
                  </button>
                </div>
              </div>
            </article>
          ))}

          {pendingProviders.length === 0 ? (
            <div className="admin-empty-state">
              <h3>No pending provider requests</h3>
              <p>All provider applications have already been reviewed.</p>
            </div>
          ) : null}
        </div>
      </div>

      <div className="admin-panel">
        <div className="admin-panel-head">
          <div>
            <h3>Reviewed providers</h3>
            <p>Approved and rejected providers are shown here for quick context.</p>
          </div>
          <span className="admin-panel-badge">{reviewedProviders.length} reviewed</span>
        </div>

        <div className="admin-card-grid">
          {reviewedProviders.map((provider) => (
            <article className="admin-card" key={provider.id}>
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
                <div>
                  <span>{provider.price}</span>
                  {formatReviewMeta(provider) ? (
                    <p className="admin-card-note">
                      Reviewed {formatReviewMeta(provider)}
                      {provider.reviewNote ? ` | ${provider.reviewNote}` : ""}
                    </p>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
