import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import PoiManagementPage from "../pages/PoiManagementPage";
import CategoryManagementPage from "../pages/CategoryManagementPage";
import TranslationManagementPage from "../pages/TranslationManagementPage";
import ContentManagementPage from "../pages/ContentManagementPage";
import AudioManagementPage from "../pages/AudioManagementPage";

function AppRouter() {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/pois" replace />} />
        <Route path="/pois" element={<PoiManagementPage />} />
        <Route path="/categories" element={<CategoryManagementPage />} />
        <Route path="/translations" element={<TranslationManagementPage />} />
        <Route path="/contents" element={<ContentManagementPage />} />
        <Route path="/audios" element={<AudioManagementPage />} />
      </Routes>
    </AdminLayout>
  );
}

export default AppRouter;