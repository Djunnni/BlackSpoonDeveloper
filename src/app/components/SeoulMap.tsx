import { useState } from 'react';
import { TrendingUp, TrendingDown, Sparkles, ChevronRight } from 'lucide-react';

interface District {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  totalInterest: number;
  dailyReturn: number;
  isAIRecommended: boolean;
  neighborhoods?: Neighborhood[];
}

interface Neighborhood {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  totalInterest: number;
  dailyReturn: number;
  zone: 'interest' | 'extreme' | 'balance';
}

const DISTRICTS: District[] = [
  {
    id: 'gangnam',
    name: '강남구',
    x: 250,
    y: 200,
    width: 120,
    height: 100,
    totalInterest: 12500000,
    dailyReturn: 2.35,
    isAIRecommended: true,
    neighborhoods: [
      { id: 'daechi', name: '대치동', x: 250, y: 200, width: 60, height: 50, totalInterest: 5200000, dailyReturn: 2.8, zone: 'extreme' },
      { id: 'yeoksam', name: '역삼동', x: 310, y: 200, width: 60, height: 50, totalInterest: 4100000, dailyReturn: 2.1, zone: 'balance' },
      { id: 'nonhyeon', name: '논현동', x: 250, y: 250, width: 60, height: 50, totalInterest: 3200000, dailyReturn: 2.2, zone: 'balance' },
    ],
  },
  {
    id: 'seocho',
    name: '서초구',
    x: 200,
    y: 250,
    width: 100,
    height: 90,
    totalInterest: 9800000,
    dailyReturn: 1.95,
    isAIRecommended: false,
    neighborhoods: [
      { id: 'seocho', name: '서초동', x: 200, y: 250, width: 50, height: 45, totalInterest: 4500000, dailyReturn: 2.0, zone: 'balance' },
      { id: 'banpo', name: '반포동', x: 250, y: 250, width: 50, height: 45, totalInterest: 3800000, dailyReturn: 1.8, zone: 'interest' },
      { id: 'jamwon', name: '잠원동', x: 200, y: 295, width: 50, height: 45, totalInterest: 1500000, dailyReturn: 2.1, zone: 'extreme' },
    ],
  },
  {
    id: 'songpa',
    name: '송파구',
    x: 370,
    y: 220,
    width: 110,
    height: 95,
    totalInterest: 11200000,
    dailyReturn: 2.52,
    isAIRecommended: true,
    neighborhoods: [
      { id: 'jamsil', name: '잠실동', x: 370, y: 220, width: 55, height: 47, totalInterest: 6200000, dailyReturn: 2.9, zone: 'extreme' },
      { id: 'munjeong', name: '문정동', x: 425, y: 220, width: 55, height: 47, totalInterest: 3000000, dailyReturn: 2.3, zone: 'balance' },
      { id: 'garak', name: '가락동', x: 370, y: 267, width: 55, height: 48, totalInterest: 2000000, dailyReturn: 2.2, zone: 'balance' },
    ],
  },
  {
    id: 'gangdong',
    name: '강동구',
    x: 480,
    y: 200,
    width: 95,
    height: 85,
    totalInterest: 6400000,
    dailyReturn: 1.68,
    isAIRecommended: false,
  },
  {
    id: 'mapo',
    name: '마포구',
    x: 120,
    y: 120,
    width: 100,
    height: 90,
    totalInterest: 8900000,
    dailyReturn: 2.15,
    isAIRecommended: true,
  },
  {
    id: 'yongsan',
    name: '용산구',
    x: 220,
    y: 150,
    width: 85,
    height: 75,
    totalInterest: 7200000,
    dailyReturn: 1.88,
    isAIRecommended: false,
  },
];

function getHeatColor(dailyReturn: number): string {
  if (dailyReturn >= 2.5) return '#ef4444'; // red-500
  if (dailyReturn >= 2.0) return '#f97316'; // orange-500
  if (dailyReturn >= 1.5) return '#eab308'; // yellow-500
  return '#22c55e'; // green-500
}

export function SeoulMap() {
  return (
    <div className="w-full">
      <div className="bg-white rounded-2xl p-12 border border-gray-200">
        <div className="flex flex-col items-center justify-center text-center py-20">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">지도 기능 준비중</h3>
          <p className="text-sm text-gray-600">
            지역별 이자 현황 지도는 곧 제공될 예정입니다
          </p>
        </div>
      </div>
    </div>
  );
}
