import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { MainApp } from "./components/MainApp";
import { SettingsPage } from "./components/pages/SettingsPage";
import { ChargePage } from "./components/pages/ChargePage";
import { NotificationsPage } from "./components/pages/NotificationsPage";
import { ReportPage } from "./components/pages/ReportPage";
import { LoginPage } from "./components/pages/LoginPage";
import { ProtectedRoute } from "./components/ProtectedRoute";

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        {/* Mock 모드가 아닐 때만 로그인 페이지 제공 */}
        {!USE_MOCK && <Route path="/login" element={<LoginPage />} />}
        
        {/* Mock 모드일 때 /login 접근 시 홈으로 리다이렉트 */}
        {USE_MOCK && <Route path="/login" element={<Navigate to="/" replace />} />}
        
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainApp />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analysis"
          element={
            <ProtectedRoute>
              <ReportPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/charge"
          element={
            <ProtectedRoute>
              <ChargePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </HashRouter>
  );
}