import { Navigate, useLocation } from "react-router-dom";

export default function RouteGuard({ allowedRole, children }) {
  const location = useLocation();
  const currentRole = localStorage.getItem("serveiq_role");
  const currentStatus = localStorage.getItem("serveiq_status");

  if (allowedRole === "provider" && currentRole === "provider" && currentStatus && currentStatus !== "active") {
    return <Navigate to="/login?mode=login&role=provider&notice=pending" replace state={{ from: location }} />;
  }

  if (currentRole !== allowedRole) {
    return <Navigate to="/auth?mode=login" replace state={{ from: location }} />;
  }

  return children;
}
