import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AppShell from "./layouts/AppShell";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import AppointmentsPage from "./pages/AppointmentsPage";
import DoctorDirectoryPage from "./pages/DoctorDirectoryPage";
import RecordsPage from "./pages/RecordsPage";
import PrescriptionsPage from "./pages/PrescriptionsPage";
import AdminPage from "./pages/AdminPage";
import VideoConsultationPage from "./pages/VideoConsultationPage";

const App = () => (
  <AppShell>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/appointments"
        element={
          <ProtectedRoute>
            <AppointmentsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctors"
        element={
          <ProtectedRoute roles={["patient"]}>
            <DoctorDirectoryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/records"
        element={
          <ProtectedRoute>
            <RecordsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/prescriptions"
        element={
          <ProtectedRoute>
            <PrescriptionsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={["admin"]}>
            <AdminPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/video/:roomId"
        element={
          <ProtectedRoute>
            <VideoConsultationPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </AppShell>
);

export default App;
