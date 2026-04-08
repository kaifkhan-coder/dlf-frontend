import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import {Login} from "./pages/Login";
import Register from "./pages/Register";
import ProfilePage from "./pages/ProfilePage";
// import ClaimModal from "./pages/ClaimModel";
import ItemsListPage from "./pages/ItemsListPage";
import ItemDetailsPage from "./pages/ItemDetailsPage";
import ReportItemPage from "./pages/ReportItem";
import HomePage from "./pages/HomePage";

import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import ClaimPage from "./pages/ClaimPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* auth */}
        <Route path="/" element={<HomePage/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<ProfilePage/>} />
        {/* public */}
        <Route path="/items" element={<ItemsListPage />} />
        <Route path="/item/:id" element={<ItemDetailsPage />} />
        <Route path="/claim/:id" element={<ClaimPage/>} />
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

        {/* admin protected */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        {/* default */}
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
