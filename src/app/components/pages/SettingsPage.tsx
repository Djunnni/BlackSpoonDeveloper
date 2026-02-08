import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../Layout';
import { Bell, Wallet, User, Shield, FileText, HelpCircle, MapPin, LogOut } from 'lucide-react';
import { useAuthStore } from '../../../lib/stores/authStore';
import { regionApi } from '../../../lib/api/services';

export function SettingsPage() {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuthStore();
  const [showRegionModal, setShowRegionModal] = useState(false);
  const [regions, setRegions] = useState<Array<{ code: string; name: string }>>([]);
  const [selectedRegionCode, setSelectedRegionCode] = useState<string>(user?.regionCode || '000000');

  // 지역 목록 로드
  useEffect(() => {
    const loadRegions = async () => {
      try {
        const regionList = await regionApi.getRegions();
        setRegions(regionList);
      } catch (error) {
        console.error('Failed to load regions:', error);
        // Mock 데이터 사용
        setRegions([
          { code: '110000', name: '서울특별시' },
          { code: '260000', name: '부산광역시' },
          { code: '270000', name: '대구광역시' },
          { code: '280000', name: '인천광역시' },
          { code: '290000', name: '광주광역시' },
          { code: '300000', name: '대전광역시' },
          { code: '310000', name: '울산광역시' },
          { code: '360000', name: '세종특별자치시' },
          { code: '410000', name: '경기도' },
          { code: '420000', name: '강원도' },
          { code: '430000', name: '충청북도' },
          { code: '440000', name: '충청남도' },
          { code: '450000', name: '전라북도' },
          { code: '460000', name: '전라남도' },
          { code: '470000', name: '경상북도' },
          { code: '480000', name: '경상남도' },
          { code: '490000', name: '제주특별자치도' },
        ]);
      }
    };
    loadRegions();
  }, []);

  const handleRegionSave = async () => {
    try {
      const updatedUser = await regionApi.setUserRegion(selectedRegionCode);
      updateUser(updatedUser);
      setShowRegionModal(false);
    } catch (error) {
      console.error('Failed to update region:', error);
      // Mock: 로컬에서 업데이트
      if (user) {
        updateUser({ ...user, regionCode: selectedRegionCode });
        setShowRegionModal(false);
      }
    }
  };

  const handleLogout = async () => {
    if (confirm('로그아웃 하시겠습니까?')) {
      await logout();
      navigate('/login', { replace: true });
    }
  };

  const currentRegion = regions.find(r => r.code === user?.regionCode);
  const hasRegion = user?.regionCode && user.regionCode !== '000000';

  const menuItems = [
    {
      id: 'region',
      icon: MapPin,
      title: '지역 선택',
      description: hasRegion ? currentRegion?.name || '지역을 선택해주세요' : '지역을 선택해주세요',
      color: hasRegion ? 'blue' : 'orange',
      onClick: () => setShowRegionModal(true),
    },
    {
      id: 'charge',
      icon: Wallet,
      title: '충전하기',
      description: 'JB 머니 충전',
      color: 'green',
      onClick: () => navigate('/charge'),
    },
    {
      id: 'notifications',
      icon: Bell,
      title: '알림 설정',
      description: '투자 알림 관리',
      color: 'blue',
      onClick: () => navigate('/notifications'),
    },
    {
      id: 'account',
      icon: User,
      title: '계정 관리',
      description: user?.email || '개인정보 및 계정 설정',
      color: 'purple',
      onClick: () => {},
    },
    {
      id: 'security',
      icon: Shield,
      title: '보안 설정',
      description: '비밀번호 및 인증',
      color: 'red',
      onClick: () => {},
    },
  ];

  const secondaryItems = [
    {
      id: 'terms',
      icon: FileText,
      title: '이용약관',
      onClick: () => {},
    },
    {
      id: 'help',
      icon: HelpCircle,
      title: '도움말',
      onClick: () => {},
    },
    {
      id: 'logout',
      icon: LogOut,
      title: '로그아웃',
      onClick: handleLogout,
    },
  ];

  return (
    <Layout>
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">설정</h1>
        {user && (
          <p className="text-sm text-gray-600 mb-6">
            {user.name}님, 안녕하세요!
          </p>
        )}

        {/* Main Settings */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-4">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const colorClasses = {
              green: 'bg-green-100 text-green-600',
              blue: 'bg-blue-100 text-blue-600',
              purple: 'bg-purple-100 text-purple-600',
              red: 'bg-red-100 text-red-600',
              orange: 'bg-orange-100 text-orange-600',
            };

            return (
              <button
                key={item.id}
                onClick={item.onClick}
                className={`w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors ${
                  index !== menuItems.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                <div className={`p-2.5 rounded-xl ${colorClasses[item.color as keyof typeof colorClasses]}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-gray-900">{item.title}</p>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Secondary Settings */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-4">
          {secondaryItems.map((item, index) => {
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={item.onClick}
                className={`w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors ${
                  index !== secondaryItems.length - 1 ? 'border-b border-gray-100' : ''
                } ${item.id === 'logout' ? 'text-red-600' : ''}`}
              >
                <Icon className={`w-5 h-5 ${item.id === 'logout' ? 'text-red-600' : 'text-gray-600'}`} />
                <p className={`flex-1 text-left font-medium ${item.id === 'logout' ? 'text-red-600' : 'text-gray-900'}`}>
                  {item.title}
                </p>
              </button>
            );
          })}
        </div>

        {/* Version Info */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">JB 머니 v1.0.0</p>
        </div>
      </div>

      {/* Region Selection Modal */}
      {showRegionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">지역 선택</h3>
              <p className="text-sm text-gray-600 mt-1">
                투자 경쟁을 위한 지역을 선택해주세요
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-2">
                {regions.map((region) => (
                  <button
                    key={region.code}
                    onClick={() => setSelectedRegionCode(region.code)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      selectedRegionCode === region.code
                        ? 'bg-blue-50 border-2 border-blue-600'
                        : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                    }`}
                  >
                    <p className={`font-semibold ${
                      selectedRegionCode === region.code ? 'text-blue-900' : 'text-gray-900'
                    }`}>
                      {region.name}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 border-t border-gray-200 flex gap-2">
              <button
                onClick={() => setShowRegionModal(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleRegionSave}
                className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
