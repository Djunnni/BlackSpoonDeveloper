import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { MainApp } from "./components/MainApp";
import { SettingsPage } from "./components/pages/SettingsPage";
import { ChargePage } from "./components/pages/ChargePage";
import { NotificationsPage } from "./components/pages/NotificationsPage";
import { ReportPage } from "./components/pages/ReportPage";
import { LoginPage } from "./components/pages/LoginPage";
import { ProtectedRoute } from "./components/ProtectedRoute";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        {/* 바로 메인 화면으로 이동 */}
        <Route path="/" element={<Navigate to="/main" replace />} />
        
        {/* 메인 앱 */}
        <Route
          path="/main"
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