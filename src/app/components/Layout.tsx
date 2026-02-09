import { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, BarChart3, Settings } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const getCurrentTab = () => {
    if (location.pathname === "/main" || location.pathname === "/") return "home";
    if (location.pathname === "/analysis") return "analysis";
    if (location.pathname === "/settings") return "settings";
    return "home";
  };

  const currentTab = getCurrentTab();

  const handleTabChange = (tab: string) => {
    if (tab === "home") navigate("/main");
    else navigate(`/${tab}`);
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col">
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pb-20">
        {children}
      </div>

      {/* Bottom Navigation - 탭바 영역 유지 (앱에서 네이티브 탭바 사용) */}
      <div className="fixed bottom-0 left-0 right-0 safe-area-inset-bottom" style={{ height: 'env(safe-area-inset-bottom)' }}>
        {/* 탭바 UI는 숨김 처리 - 영역만 유지 */}
      </div>
    </div>
  );
}