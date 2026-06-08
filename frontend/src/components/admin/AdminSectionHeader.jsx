export default function AdminSectionHeader({ label, title, subtitle, meta, dark = false }) {
  const labelStyle = dark
    ? { background: "rgba(255, 255, 255, 0.08)", color: "rgba(255, 255, 255, 0.82)" }
    : undefined;

  const titleStyle = dark ? { color: "white" } : undefined;
  const subtitleStyle = dark ? { color: "rgba(255, 255, 255, 0.68)" } : undefined;
  const metaStyle = dark
    ? {
        background: "rgba(91, 78, 255, 0.16)",
        color: "white",
        borderColor: "rgba(91, 78, 255, 0.22)",
      }
    : undefined;

  return (
    <div className="admin-section-header">
      <div>
        <div className="section-label" style={labelStyle}>
          {label}
        </div>
        <h2 className="section-title" style={titleStyle}>
          {title}
        </h2>
        {subtitle ? (
          <p className="section-sub" style={subtitleStyle}>
            {subtitle}
          </p>
        ) : null}
      </div>
      {meta ? <div className="admin-section-meta" style={metaStyle}>{meta}</div> : null}
    </div>
  );
}
