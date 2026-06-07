import { chartColors, chartData, kpis, recentBookings } from "../../data/serveiqData";
import SectionHeader from "../SectionHeader";

export default function DashboardSection({ onToast }) {
  const chartMax = Math.max(...chartData);

  return (
    <section id="dashboard">
      <div className="container">
        <div className="text-center dashboard-header">
          <SectionHeader
            label="📊 Admin Analytics"
            title="Comprehensive Admin Dashboard"
            subtitle="Real-time analytics on platform performance, user growth, revenue, provider performance, and fraud monitoring."
            centered
          />
        </div>
        <div className="dashboard-preview fade-up">
          <div className="dash-topbar">
            <span className="dash-topbar-title">ServeIQ Admin Dashboard</span>
            <div className="dash-topbar-actions">
              <span>📅 June 2025</span>
              <span className="live-pill">⚡ Live</span>
            </div>
          </div>
          <div className="dash-body">
            <div className="dash-sidebar">
              {["Overview", "Users", "Bookings", "Payments", "Fraud Monitor", "Providers", "Reports", "Settings"].map((item, index) => (
                <div
                  key={item}
                  className={`dash-menu-item ${index === 0 ? "active" : ""}`}
                  onClick={() => index !== 0 && onToast(`Loading ${item.toLowerCase()}...`, "ℹ️")}
                >
                  <span className="dash-menu-icon">
                    {["📊", "👥", "📋", "💳", "🛡️", "⭐", "📈", "⚙️"][index]}
                  </span>
                  {item}
                </div>
              ))}
            </div>
            <div className="dash-content">
              <div className="kpi-grid">
                {kpis.map((kpi) => (
                  <div className="kpi-card" key={kpi.label}>
                    <div className="kpi-label">{kpi.label}</div>
                    <div className="kpi-value">{kpi.value}</div>
                    <div className={`kpi-change ${kpi.trend}`}>{kpi.change}</div>
                  </div>
                ))}
              </div>
              <div className="chart-placeholder">
                <div className="chart-title">Monthly Bookings & Revenue - 2025</div>
                <div className="chart-bars" id="chartBars">
                  {chartData.map((value, index) => (
                    <div
                      key={`${value}-${index}`}
                      className="chart-bar"
                      style={{
                        height: `${(value / chartMax) * 100}%`,
                        background: chartColors[index],
                        opacity: index === chartData.length - 1 ? 1 : 0.6,
                      }}
                      title={`${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][index]}: ${value * 82} bookings`}
                    />
                  ))}
                </div>
                <div className="chart-months">
                  {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((month) => (
                    <span key={month}>{month}</span>
                  ))}
                </div>
              </div>
              <div className="recent-title">Recent Bookings</div>
              <table className="recent-table">
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Customer</th>
                    <th>Service</th>
                    <th>Provider</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map(([id, customer, service, provider, amount, status]) => (
                    <tr key={id}>
                      <td className="booking-id">{id}</td>
                      <td>{customer}</td>
                      <td>{service}</td>
                      <td>{provider}</td>
                      <td>{amount}</td>
                      <td>
                        <span className={`status-pill ${status.toLowerCase()}`}>{status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

