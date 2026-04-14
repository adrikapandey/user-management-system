import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "./layouts/AppLayout.jsx";
import { ProtectedRoute } from "./components/ProtectedRoute.jsx";
import { LoginPage } from "./pages/LoginPage.jsx";
import { DashboardPage } from "./pages/DashboardPage.jsx";
import { UsersPage } from "./pages/UsersPage.jsx";
import { ProfilePage } from "./pages/ProfilePage.jsx";
import { UserDetailPage } from "./pages/UserDetailPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route
          path="users"
          element={
            <ProtectedRoute allowedRoles={["admin", "manager"]}>
              <UsersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="users/:userId"
          element={
            <ProtectedRoute allowedRoles={["admin", "manager"]}>
              <UserDetailPage />
            </ProtectedRoute>
          }
        />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
