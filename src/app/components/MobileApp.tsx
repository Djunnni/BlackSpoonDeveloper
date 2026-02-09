import { useState } from 'react';
import { Home, Map, Settings, ArrowUpRight, ChevronRight, Bell, Wallet, CreditCard, TrendingUp } from 'lucide-react';
import { ZoneCard } from './ZoneCard';
import { SeoulMap } from './SeoulMap';
import { InterestZone } from './InterestZone';
import { ExtremeZone } from './ExtremeZone';
import { BalanceZone } from './BalanceZone';
import { ChargeMoney } from './ChargeMoney';
import { TomorrowZoneSelector } from './TomorrowZoneSelector';
import { TomorrowZoneSetup } from './TomorrowZoneSetup';

type Zone = 'interest' | 'extreme' | 'balance';
type Tab = 'home' | 'map' | 'settings';
type SettingsView = 'menu' | 'charge' | 'notifications';

export function MobileApp() {
  const [todayZone, setTodayZone] = useState<Zone>('interest');
  const [tomorrowZone, setTomorrowZone] = useState<Zone>('interest');
  const [currentTab, setCurrentTab] = useState<Tab>('home');
  const [showZoneDetail, setShowZoneDetail] = useState(false);
  const [selectedZoneForDetail, setSelectedZoneForDetail] = useState<Zone>('interest');
  const [settingsView, setSettingsView] = useState<SettingsView>('menu');
  const [showTomorrowZoneSetup, setShowTomorrowZoneSetup] = useState(false);
  const [setupZoneType, setSetupZoneType] = useState<'extreme' | 'balance'>('extreme');

  const totalBalance = 15750000;
  const totalProfit = 21500;
  const totalReturn = 2.3;

  const handleZoneClick = (zone: Zone) => {
    setSelectedZoneForDetail(zone);
    setShowZoneDetail(true);
  };

  const handleTomorrowZoneClick = (zone: Zone) => {
    if (zone === 'interest') {
      setTomorrowZone('interest');
    } else if (zone === 'extreme') {
      setSetupZoneType('extreme');
      setShowTomorrowZoneSetup(true);
    } else if (zone === 'balance') {
      setSetupZoneType('balance');
      setShowTomorrowZoneSetup(true);
    }
  };

  const handleTomorrowZoneSave = (zone: Zone) => {
    setTomorrowZone(zone);
    setShowTomorrowZoneSetup(false);
  };

  const renderSettingsContent = () => {
    if (settingsView === 'charge') {
      return (
        <div className="p-6">
          <button
            onClick={() => setSettingsView('menu')}
            className="mb-4 text-gray-600 hover:text-gray-900"
          >
            ← 뒤로
          </button>
          <ChargeMoney />
        </div>
      );
    }

    if (settingsView === 'notifications') {
      return (
        <div className="p-6">
          <button
            onClick={() => setSettingsView('menu')}
            className="mb-4 text-gray-600 hover:text-gray-900"
          >
            ← 뒤로
          </button>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">알림 설정</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200">
              <div>
                <p className="font-medium text-gray-900">일일 이자 발생 알림</p>
                <p className="text-sm text-gray-600">매일 오전 9시</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200">
              <div>
                <p className="font-medium text-gray-900">존 변경 알림</p>
                <p className="text-sm text-gray-600">매일 자정</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200">
              <div>
                <p className="font-medium text-gray-900">수익률 알림</p>
                <p className="text-sm text-gray-600">목표 수익률 달성 시</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200">
              <div>
                <p className="font-medium text-gray-900">마케팅 알림</p>
                <p className="text-sm text-gray-600">이벤트 및 혜택</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">설정</h2>
        <div className="space-y-4">
          <button
            onClick={() => setSettingsView('charge')}
            className="w-full p-4 bg-white rounded-xl border border-gray-200 flex items-center justify-between hover:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Wallet className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">JB머니 충전</p>
                <p className="text-sm text-gray-600">JB계좌에서 금고로 이체</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
          <button
            onClick={() => setSettingsView('notifications')}
            className="w-full p-4 bg-white rounded-xl border border-gray-200 flex items-center justify-between hover:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Bell className="w-5 h-5 text-purple-600" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">알림 설정</p>
                <p className="text-sm text-gray-600">푸시 알림 관리</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
          <button className="w-full p-4 bg-white rounded-xl border border-gray-200 flex items-center justify-between hover:bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CreditCard className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">계좌 정보</p>
                <p className="text-sm text-gray-600">계좌 상세 정보</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (showTomorrowZoneSetup) {
      return (
        <TomorrowZoneSetup
          zone={setupZoneType}
          onSave={handleTomorrowZoneSave}
          onCancel={() => setShowTomorrowZoneSetup(false)}
        />
      );
    }

    if (currentTab === 'map') {
      return (
        <div className="p-6">
          <SeoulMap />
        </div>
      );
    }

    if (currentTab === 'settings') {
      return renderSettingsContent();
    }

    if (showZoneDetail) {
      return (
        <div className="p-6">
          <button
            onClick={() => setShowZoneDetail(false)}
            className="mb-4 text-gray-600 hover:text-gray-900"
          >
            ← 뒤로
          </button>
          {selectedZoneForDetail === 'interest' && <InterestZone />}
          {selectedZoneForDetail === 'extreme' && <ExtremeZone />}
          {selectedZoneForDetail === 'balance' && <BalanceZone />}
        </div>
      );
    }

    return (
      <div className="p-6 space-y-6">
        {/* Balance Card */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <div className="mb-4">
            <p className="text-sm text-blue-100">JB 머니</p>
          </div>
          <h1 className="text-3xl font-bold mb-6">
            {totalBalance.toLocaleString()}원
          </h1>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/20 rounded-xl p-3">
              <p className="text-xs text-blue-100 mb-1">오늘 발생 이자</p>
              <p className="text-lg font-semibold">+{totalProfit.toLocaleString()}원</p>
            </div>
            <div className="bg-white/20 rounded-xl p-3">
              <p className="text-xs text-blue-100 mb-1">일 수익률</p>
              <p className="text-lg font-semibold">+{totalReturn}%</p>
            </div>
          </div>
        </div>

        {/* Today & Tomorrow Zone Selection */}
        <div className="space-y-4">
          {/* Today Zone - 컴팩트 디자인 */}
          <button
            onClick={() => handleZoneClick(todayZone)}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-4 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-blue-100 mb-0.5">투자중인 존 · 오늘</p>
                  <h3 className="font-bold text-white">
                    {todayZone === 'interest' && '이자존'}
                    {todayZone === 'extreme' && '이자워크존'}
                    {todayZone === 'balance' && '파워워크존'}
                  </h3>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-blue-100 mb-0.5">일 수익률</p>
                <p className="font-bold text-white">+{totalReturn}%</p>
              </div>
            </div>
          </button>

          {/* Tomorrow Zone Selection */}
          <TomorrowZoneSelector 
            tomorrowZone={tomorrowZone}
            onZoneClick={handleTomorrowZoneClick}
          />
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">빠른 메뉴</h2>
          <div className="grid grid-cols-2 gap-3">
            <button className="p-4 bg-white rounded-xl border border-gray-200 hover:bg-gray-50">
              <p className="font-medium text-gray-900">거래내역</p>
            </button>
            <button className="p-4 bg-white rounded-xl border border-gray-200 hover:bg-gray-50">
              <p className="font-medium text-gray-900">수익 분석</p>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-[430px] mx-auto h-screen bg-gray-50 flex flex-col">
      {/* Status Bar */}
      <div className="bg-white px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-end">
          <span className="text-sm text-gray-600">9:41</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {renderContent()}
      </div>

      {/* Bottom Navigation */}
      <div className="bg-white border-t border-gray-200 px-6 py-4">
        <div className="flex items-center justify-around">
          <button
            onClick={() => {
              setCurrentTab('home');
              setShowZoneDetail(false);
              setSettingsView('menu');
            }}
            className={`flex flex-col items-center gap-1 ${
              currentTab === 'home' ? 'text-blue-600' : 'text-gray-400'
            }`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs">홈</span>
          </button>
          <button
            onClick={() => {
              setCurrentTab('map');
              setShowZoneDetail(false);
              setSettingsView('menu');
            }}
            className={`flex flex-col items-center gap-1 ${
              currentTab === 'map' ? 'text-blue-600' : 'text-gray-400'
            }`}
          >
            <Map className="w-6 h-6" />
            <span className="text-xs">지역</span>
          </button>
          <button
            onClick={() => {
              setCurrentTab('settings');
              setShowZoneDetail(false);
            }}
            className={`flex flex-col items-center gap-1 ${
              currentTab === 'settings' ? 'text-blue-600' : 'text-gray-400'
            }`}
          >
            <Settings className="w-6 h-6" />
            <span className="text-xs">설정</span>
          </button>
        </div>
      </div>
    </div>
  );
}
