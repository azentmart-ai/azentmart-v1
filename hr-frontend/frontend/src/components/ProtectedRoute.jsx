import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const HR_ROLES = new Set(["hr_admin", "hr_manager", "admin"]);

export default function ProtectedRoute({ children }) {
  const { token, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="loading">Checking your HR session...</div>;
  }

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (!HR_ROLES.has(user?.role)) {
    return <Navigate to="/login" replace state={{ message: "Only authorized HR users can access this workspace." }} />;
  }

  return children;
}
