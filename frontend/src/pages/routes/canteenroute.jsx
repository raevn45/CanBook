import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/authcontext";

export default function CanteenRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "canteen") {
    return <Navigate to="/student" replace />;
  }

  return children;
}
