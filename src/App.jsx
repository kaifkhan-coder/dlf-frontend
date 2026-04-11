import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Login } from "./pages/Login";
import Register from "./pages/Register";
import ProfilePage from "./pages/ProfilePage";
import ItemsListPage from "./pages/ItemsListPage";
import ItemDetailsPage from "./pages/ItemDetailsPage";
import ReportItemPage from "./pages/ReportItem";
import HomePage from "./pages/HomePage";

import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";

import useAutoLogout from "./pages/useAutoLogout";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import ClaimPage from "./pages/ClaimPage";
import AdminClaimsPage from "./pages/AdminClaims";

function AppContent() {
  useAutoLogout(); // ✅ NOW inside router

  return (
    <Routes>
      {/* auth */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<ProfilePage />} />

      {/* public */}
      <Route path="/items" element={<ItemsListPage />} />
      <Route path="/item/:id" element={<ItemDetailsPage />} />
      <Route path="/claim/:id" element={<ClaimPage />} />
      <Route path="/admin-approval/:id" element={<AdminClaimsPage />} />

      {/* user protected */}
      <Route
        path="/report"
        element={
          <ProtectedRoute>
            <ReportItemPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <UserDashboard />
          </ProtectedRoute>
        }
      />

      {/* admin */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />

      {/* fallback */}
      <Route path="*" element={<Login />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}