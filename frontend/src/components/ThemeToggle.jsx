export default function ThemeToggle({ theme, onToggle, compact = false }) {
  const isDark = theme === "dark";
  const nextTheme = isDark ? "light" : "dark";

  return (
    <button
      type="button"
      className={`theme-toggle ${compact ? "theme-toggle--compact" : ""}`}
      onClick={onToggle}
      aria-label={`Switch to ${nextTheme} theme`}
      aria-pressed={isDark}
      title={`Switch to ${nextTheme} theme`}
    >
      <span className="theme-toggle-icon" aria-hidden="true">{isDark ? "☀" : "☾"}</span>
      {!compact && <span>{isDark ? "Light" : "Dark"}</span>}
    </button>
  );
}
