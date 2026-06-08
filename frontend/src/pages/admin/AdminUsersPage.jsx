import AdminMetricGrid from "../../components/admin/AdminMetricGrid";
import AdminSectionHeader from "../../components/admin/AdminSectionHeader";
import AdminStatusPill from "../../components/admin/AdminStatusPill";
import AdminTable from "../../components/admin/AdminTable";
import { adminFallbackData } from "../../data/adminFallbackData";
import { useAdminResource } from "../../hooks/useAdminResource";

export default function AdminUsersPage() {
  const { data, loading, error, source } = useAdminResource("/users", adminFallbackData.users);

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
