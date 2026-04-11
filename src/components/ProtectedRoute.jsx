import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  try {
    const parsedUser = JSON.parse(user);
    if (!parsedUser?.id) {
      throw new Error("Invalid user");
    }
  } catch {
    localStorage.clear(); // 🔥 auto cleanup
    return <Navigate to="/login" replace />;
  }

  return children;
}