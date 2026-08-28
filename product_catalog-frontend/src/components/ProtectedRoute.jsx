import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, requiredRole }) => {
  const location = useLocation();
  const { user, token, isAuthenticated } = useAuth();

  // 1. Check Authentication
  if (!isAuthenticated || !token || !user) {
    Swal.fire({
      icon: "info",
      title: "Login Required",
      text: "Please log in to continue.",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });

    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Check Role Authorization
  if (requiredRole) {
    const userRole = user?.role?.toLowerCase();
    const required = requiredRole.toLowerCase();

    if (userRole !== required) {
      Swal.fire({
        icon: "error",
        title: "Access Denied",
        text: "You do not have permission to view this page.",
        confirmButtonColor: "#ef4444",
      });

      return <Navigate to="/" replace />;
    }
  }

  // 3. Authorized
  return children;
};

export default ProtectedRoute;