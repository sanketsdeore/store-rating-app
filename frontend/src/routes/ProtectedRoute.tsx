import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({
  children,
}: {
  children: React.ReactNode
}) {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;