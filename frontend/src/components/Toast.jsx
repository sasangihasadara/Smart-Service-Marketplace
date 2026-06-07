export default function Toast({ toast }) {
  return (
    <div className={`toast ${toast ? "show" : ""}`}>
      <span className="toast-icon">{toast?.icon || "✅"}</span>
      <span>{toast?.message || "Action completed"}</span>
    </div>
  );
}

