import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import NavBar from "./components/NavBar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Activities from "./pages/Activities";
import ActivityDetail from "./pages/ActivityDetail";
import ActivityForm from "./pages/ActivityForm";
import Notifications from "./pages/Notifications";
import Announcements from "./pages/Announcements";
import Categories from "./pages/Categories";
import Profile from "./pages/Profile";
import OfflineBanner from "./components/OfflineBanner";

function HomeRedirect() {
  const { user, initializing } = useAuth();

  if (initializing) return <p className="loading-state">Loading...</p>;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <Navigate
      to={user.role === "ADMIN" ? "/admin/dashboard" : "/dashboard"}
      replace
    />
  );
}

function AppRoutes() {
  const { initializing } = useAuth();
  if (initializing) return <p className="loading-state">Loading...</p>;

  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/activities"
        element={
          <ProtectedRoute>
            <Activities />
          </ProtectedRoute>
        }
      />
      <Route
        path="/activities/new"
        element={
          <ProtectedRoute>
            <ActivityForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/activities/:id"
        element={
          <ProtectedRoute>
            <ActivityDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/activities/:id/edit"
        element={
          <ProtectedRoute>
            <ActivityForm />
          </ProtectedRoute>
        }
      />

      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        }
      />
      <Route
        path="/announcements"
        element={
          <ProtectedRoute>
            <Announcements />
          </ProtectedRoute>
        }
      />
      <Route
        path="/categories"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <Categories />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <OfflineBanner />
        <NavBar />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
