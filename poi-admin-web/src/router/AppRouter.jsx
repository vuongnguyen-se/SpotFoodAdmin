import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import ProtectedRoute from "../components/ProtectedRoute";

import LoginPage from "../pages/LoginPage";
import PoiManagementPage from "../pages/PoiManagementPage";
import CategoryManagementPage from "../pages/CategoryManagementPage";
import TranslationManagementPage from "../pages/TranslationManagementPage";
import ContentManagementPage from "../pages/ContentManagementPage";
import AudioManagementPage from "../pages/AudioManagementPage";
import MonitoringPage from "../pages/MonitoringPage";

function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <Navigate to="/pois" replace />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/pois"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <PoiManagementPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/categories"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <CategoryManagementPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/translations"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <TranslationManagementPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/contents"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <ContentManagementPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/audios"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <AudioManagementPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/monitoring"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <MonitoringPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default AppRouter;