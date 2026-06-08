export default function AdminMetricGrid({ metrics }) {
  return (
    <div className="admin-metric-grid">
      {metrics.map((metric) => (
        <article className="admin-metric-card" key={metric.label}>
          <div className="admin-metric-label">{metric.label}</div>
          <div className="admin-metric-value">{metric.value}</div>
          <div className={`admin-metric-change ${metric.trend === "down" ? "down" : "up"}`}>
            {metric.change}
          </div>
        </article>
      ))}
    </div>
  );
}
