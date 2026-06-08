const toneMap = {
  active: "green",
  approved: "green",
  completed: "green",
  pending: "amber",
  review: "amber",
  under: "amber",
  cancelled: "red",
  suspended: "red",
  high: "red",
  medium: "amber",
  low: "green",
};

export default function AdminStatusPill({ value }) {
  const lowerValue = String(value).toLowerCase();
  const tone = Object.keys(toneMap).find((key) => lowerValue.includes(key)) || "amber";

  return <span className={`status-pill admin-status ${tone}`}>{value}</span>;
}
