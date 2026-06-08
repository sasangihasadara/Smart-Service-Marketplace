import AdminMetricGrid from "../../components/admin/AdminMetricGrid";
import AdminSectionHeader from "../../components/admin/AdminSectionHeader";
import AdminStatusPill from "../../components/admin/AdminStatusPill";
import AdminTable from "../../components/admin/AdminTable";
import { adminFallbackData } from "../../data/adminFallbackData";
import { useAdminResource } from "../../hooks/useAdminResource";

export default function AdminBookingsPage() {
  const { data, loading, error, source } = useAdminResource("/bookings", adminFallbackData.bookings);

  return (
    <div className="admin-page">
      <AdminSectionHeader
        label="Bookings"
        title="Booking Operations"
        subtitle="Track payment state, service status, and booking throughput."
        meta={source === "api" ? "Synced from backend API" : "Showing offline fallback data"}
      />

      {error ? <div className="admin-banner warning">Backend unavailable. Using fallback data.</div> : null}
      {loading ? <div className="admin-loading">Loading booking records...</div> : null}

      <AdminMetricGrid metrics={data.summary} />

      <div className="admin-panel">
        <AdminTable
          columns={["id", "service", "customer", "provider", "amount", "status", "paymentMethod", "slot"]}
          rows={data.bookings}
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
