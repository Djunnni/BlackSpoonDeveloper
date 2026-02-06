import { HashRouter, Routes, Route } from "react-router-dom";
import { MainApp } from "./components/MainApp";
import { SettingsPage } from "./components/pages/SettingsPage";
import { ChargePage } from "./components/pages/ChargePage";
import { NotificationsPage } from "./components/pages/NotificationsPage";
import { ReportPage } from "./components/pages/ReportPage";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<MainApp />} />
        <Route path="/report" element={<ReportPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/charge" element={<ChargePage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
      </Routes>
    </HashRouter>
  );
}
