import React from "react";
import { Navigate } from "react-router";
import { useAuth } from "../../store/AuthContext";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
