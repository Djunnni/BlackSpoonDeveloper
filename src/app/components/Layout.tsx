import { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Map, Settings } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const getCurrentTab = () => {
    if (location.pathname === '/') return 'home';
    if (location.pathname === '/map') return 'map';
    if (location.pathname === '/settings') return 'settings';
    return 'home';
  };

  const currentTab = getCurrentTab();

  const handleTabChange = (tab: string) => {
    if (tab === 'home') navigate('/');
    else navigate(`/${tab}`);
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col">
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pb-20">
        {children}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-inset-bottom">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleTabChange('home')}
              className={`flex flex-col items-center py-3 px-2 transition-colors ${
                currentTab === 'home' ? 'text-blue-600' : 'text-gray-400'
              }`}
            >
              <Home className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">홈</span>
            </button>
            <button
              onClick={() => handleTabChange('map')}
              className={`flex flex-col items-center py-3 px-2 transition-colors ${
                currentTab === 'map' ? 'text-blue-600' : 'text-gray-400'
              }`}
            >
              <Map className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">지도</span>
            </button>
            <button
              onClick={() => handleTabChange('settings')}
              className={`flex flex-col items-center py-3 px-2 transition-colors ${
                currentTab === 'settings' ? 'text-blue-600' : 'text-gray-400'
              }`}
            >
              <Settings className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">설정</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
