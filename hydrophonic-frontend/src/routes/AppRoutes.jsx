import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/common/ProtectedRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Market from "../pages/Market";
import Complaints from "../pages/Complaints";
import NotFound from "../pages/NotFound";
import FarmerDashboard from "../pages/farmer/FarmerDashboard";
import IoTDashboard from "../pages/farmer/IoTDashboard";
import FarmerAI from "../pages/farmer/FarmerAI";
import FarmerMarket from "../pages/farmer/FarmerMarket";
import AdminDashboard from "../pages/admin/AdminDashboard";
import TraderDashboard from "../pages/trader/TraderDashboard";
import ConsumerDashboard from "../pages/consumer/ConsumerDashboard";
import TraderMarket from "../pages/trader/TraderMarket";
import ConsumerMarket from "../pages/consumer/ConsumerMarket";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/market" element={<Market />} />

      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/farmer/dashboard"
          element={
            <ProtectedRoute roles={["farmer"]}>
              <FarmerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/farmer/iot"
          element={
            <ProtectedRoute roles={["farmer"]}>
              <IoTDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/farmer/ai"
          element={
            <ProtectedRoute roles={["farmer"]}>
              <FarmerAI />
            </ProtectedRoute>
          }
        />
        <Route
          path="/farmer/market"
          element={
            <ProtectedRoute roles={["farmer"]}>
              <FarmerMarket />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trader/dashboard"
          element={
            <ProtectedRoute roles={["trader"]}>
              <TraderDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trader/market"
          element={
            <ProtectedRoute roles={["trader"]}>
              <TraderMarket />
            </ProtectedRoute>
          }
        />
        <Route
          path="/consumer/dashboard"
          element={
            <ProtectedRoute roles={["consumer"]}>
              <ConsumerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/consumer/market"
          element={
            <ProtectedRoute roles={["consumer"]}>
              <ConsumerMarket />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/market"
          element={
            <ProtectedRoute roles={["admin"]}>
              <Market />
            </ProtectedRoute>
          }
        />
        <Route path="/complaints" element={<Complaints />} />
      </Route>

      <Route path="/dashboard" element={<Navigate to="/" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
