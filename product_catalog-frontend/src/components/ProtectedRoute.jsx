import { Navigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";

/**
 * ProtectedRoute: Wraps components to ensure user is logged in
 * and optionally has the required role (e.g., 'ADMIN').
 */
const ProtectedRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const location = useLocation();

  // 1. Check if the user is logged in
  if (!token) {
    Swal.fire({
      icon: "info",
      title: "Login Required",
      text: "Please log in to continue.",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
    });
    // Redirect to login, but save the location they were trying to visit
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Check for Role Authorization (if requiredRole is specified)
  if (requiredRole && user?.role?.toLowerCase() !== requiredRole.toLowerCase()) {
    Swal.fire({
      icon: "error",
      title: "Access Denied",
      text: "You do not have permission to view this page.",
    });
    // Redirect unauthorized users to home or dashboard
    return <Navigate to="/" replace />;
  }

  // 3. User is authenticated and authorized
  return children;
};

export default ProtectedRoute;