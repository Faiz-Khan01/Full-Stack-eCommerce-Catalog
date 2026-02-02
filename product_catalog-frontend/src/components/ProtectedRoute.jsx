import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  // Get the string from localStorage and turn it back into an object
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    // If no user object exists, redirect to login
    return <Navigate to="/login" replace />;
  }

  // Ensure user.role exists before calling .toLowerCase() to avoid errors
  const userRole = user.role ? user.role.toLowerCase() : "";
  const isAuthorized = allowedRoles.includes(userRole);

  if (!isAuthorized) {
    alert("Access Denied: You do not have permission to view this page.");
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;  