import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainApp } from "./components/MainApp";
import { MapPage } from "./components/pages/MapPage";
import { SettingsPage } from "./components/pages/SettingsPage";
import { ChargePage } from "./components/pages/ChargePage";
import { NotificationsPage } from "./components/pages/NotificationsPage";

export default function App() {
  return (
    <BrowserRouter basename="/BlackSpoonDeveloper">
      <Routes>
        <Route path="/" element={<MainApp />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/charge" element={<ChargePage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
      </Routes>
    </BrowserRouter>
  );
}
