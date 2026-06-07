import { Navigate, useLocation } from "react-router-dom";

export default function RouteGuard({ allowedRole, children }) {
  const location = useLocation();
  const currentRole = localStorage.getItem("serveiq_role");

  if (currentRole !== allowedRole) {
    return <Navigate to="/services" replace state={{ from: location }} />;
  }

  return children;
}
