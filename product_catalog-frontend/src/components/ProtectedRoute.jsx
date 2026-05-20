import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  // If user not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Safe role check
  const userRole = user.role?.toLowerCase() || "";

  // Check authorization
  const isAuthorized = allowedRoles.includes(userRole);

  // Unauthorized
  if (!isAuthorized) {
    alert("Access Denied!");
    return <Navigate to="/" replace />;
  }

  // Authorized
  return children;
};

export default ProtectedRoute;