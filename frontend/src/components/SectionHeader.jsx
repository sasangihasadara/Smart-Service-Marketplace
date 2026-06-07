export default function SectionHeader({ label, title, subtitle, centered = false, dark = false }) {
  return (
    <div className={centered ? "text-center" : ""}>
      <div className="section-label" style={dark ? { background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.8)" } : undefined}>
        {label}
      </div>
      <h2 className="section-title" style={dark ? { color: "white" } : undefined}>
        {title}
      </h2>
      {subtitle ? (
        <p className="section-sub" style={centered ? { margin: "0 auto" } : undefined}>
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

