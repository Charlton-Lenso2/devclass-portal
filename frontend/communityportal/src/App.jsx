import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Activities from "./pages/Activities";
import ActivityDetail from "./pages/ActivityDetail";
import ActivityForm from "./pages/ActivityForm";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
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
            path="/activities"
            element={
              <ProtectedRoute>
                <Activities />
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
            path="/activities/new"
            element={
              <ProtectedRoute>
                <ActivityForm />
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
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
