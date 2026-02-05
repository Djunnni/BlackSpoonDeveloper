import { useNavigate } from 'react-router-dom';
import { Layout } from '../Layout';
import { Bell, Wallet, CreditCard, User, Shield, FileText, HelpCircle, LogOut } from 'lucide-react';

export function SettingsPage() {
  const navigate = useNavigate();

  const menuItems = [
    {
      id: 'charge',
      icon: Wallet,
      title: '충전하기',
      description: 'JB 머니 충전',
      color: 'green',
      path: '/charge',
    },
    {
      id: 'notifications',
      icon: Bell,
      title: '알림 설정',
      description: '투자 알림 관리',
      color: 'blue',
      path: '/notifications',
    },
    {
      id: 'account',
      icon: User,
      title: '계정 관리',
      description: '개인정보 및 계정 설정',
      color: 'purple',
      path: '/account',
    },
    {
      id: 'security',
      icon: Shield,
      title: '보안 설정',
      description: '비밀번호 및 인증',
      color: 'red',
      path: '/security',
    },
  ];

  const secondaryItems = [
    {
      id: 'terms',
      icon: FileText,
      title: '이용약관',
      path: '/terms',
    },
    {
      id: 'help',
      icon: HelpCircle,
      title: '도움말',
      path: '/help',
    },
  ];

  return (
    <Layout>
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">설정</h1>

        {/* Main Settings */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-4">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const colorClasses = {
              green: 'bg-green-100 text-green-600',
              blue: 'bg-blue-100 text-blue-600',
              purple: 'bg-purple-100 text-purple-600',
              red: 'bg-red-100 text-red-600',
            };

            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
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
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors ${
                  index !== secondaryItems.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                <Icon className="w-5 h-5 text-gray-600" />
                <p className="flex-1 text-left font-medium text-gray-900">{item.title}</p>
              </button>
            );
          })}
        </div>

        {/* Logout Button */}
        <button className="w-full bg-white rounded-2xl border border-gray-200 p-4 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-red-600 font-semibold">
          <LogOut className="w-5 h-5" />
          로그아웃
        </button>

        {/* Version Info */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">JB 머니 v1.0.0</p>
        </div>
      </div>
    </Layout>
  );
}
