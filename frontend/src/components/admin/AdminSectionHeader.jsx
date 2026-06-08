export default function AdminSectionHeader({ label, title, subtitle, meta }) {
  return (
    <div className="admin-section-header">
      <div>
        <div className="section-label">{label}</div>
        <h2 className="section-title">{title}</h2>
        {subtitle ? <p className="section-sub">{subtitle}</p> : null}
      </div>
      {meta ? <div className="admin-section-meta">{meta}</div> : null}
    </div>
  );
}
