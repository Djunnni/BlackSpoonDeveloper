import { Layout } from "../Layout";
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
  Target,
  Clock,
} from "lucide-react";

interface InvestmentRecord {
  id: string;
  date: string;
  zone: "interest" | "extreme" | "balance";
  theme?: string;
  ratio?: number;
  principal: number;
  profit: number;
  returnRate: number;
  status: "completed" | "ongoing";
}

const mockInvestmentData: InvestmentRecord[] = [
  {
    id: "1",
    date: "2026-02-06",
    zone: "extreme",
    theme: "미국 테크",
    principal: 15750000,
    profit: 48200,
    returnRate: 3.2,
    status: "ongoing",
  },
  {
    id: "2",
    date: "2026-02-05",
    zone: "extreme",
    theme: "AI/클라우드",
    principal: 15700000,
    profit: 36500,
    returnRate: 2.3,
    status: "completed",
  },
  {
    id: "3",
    date: "2026-02-04",
    zone: "balance",
    ratio: 50,
    principal: 15650000,
    profit: 28300,
    returnRate: 1.8,
    status: "completed",
  },
  {
    id: "4",
    date: "2026-02-03",
    zone: "interest",
    principal: 15600000,
    profit: 21500,
    returnRate: 1.4,
    status: "completed",
  },
  {
    id: "5",
    date: "2026-02-02",
    zone: "extreme",
    theme: "반도체",
    principal: 15550000,
    profit: -15200,
    returnRate: -0.98,
    status: "completed",
  },
  {
    id: "6",
    date: "2026-02-01",
    zone: "balance",
    ratio: 25,
    principal: 15500000,
    profit: 18700,
    returnRate: 1.2,
    status: "completed",
  },
];

export function ReportPage() {
  const totalInvested = mockInvestmentData.reduce(
    (sum, record) => sum + record.principal,
    0,
  );
  const totalProfit = mockInvestmentData.reduce(
    (sum, record) => sum + record.profit,
    0,
  );
  const avgReturn = (totalProfit / totalInvested) * 100;
  const positiveRecords = mockInvestmentData.filter((r) => r.profit > 0).length;
  const winRate = (positiveRecords / mockInvestmentData.length) * 100;

  const getZoneLabel = (zone: "interest" | "extreme" | "balance") => {
    if (zone === "interest") return "이자존";
    if (zone === "extreme") return "익스트림존";
    return "밸런스존";
  };

  const getZoneColor = (zone: "interest" | "extreme" | "balance") => {
    if (zone === "interest") return "bg-blue-100 text-blue-700";
    if (zone === "extreme") return "bg-orange-100 text-orange-700";
    return "bg-purple-100 text-purple-700";
  };

  return (
    <Layout>
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">투자 분석</h1>
          <p className="text-sm text-gray-600">
            투자 내역과 수익률을 확인하세요
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-5 border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-sm text-gray-600">총 투자금액</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {totalInvested.toLocaleString()}원
            </p>
          </div>

          <div className="bg-white rounded-xl p-5 border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-sm text-gray-600">총 수익금</p>
            </div>
            <p
              className={`text-2xl font-bold ${totalProfit >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              {totalProfit >= 0 ? "+" : ""}
              {totalProfit.toLocaleString()}원
            </p>
          </div>

          <div className="bg-white rounded-xl p-5 border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Target className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-sm text-gray-600">평균 수익률</p>
            </div>
            <p
              className={`text-2xl font-bold ${avgReturn >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              {avgReturn >= 0 ? "+" : ""}
              {avgReturn.toFixed(2)}%
            </p>
          </div>

          <div className="bg-white rounded-xl p-5 border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <p className="text-sm text-gray-600">수익률</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {winRate.toFixed(0)}%
            </p>
          </div>
        </div>

        {/* Investment Records */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-5 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">투자 내역</h2>
          </div>

          <div className="divide-y divide-gray-200">
            {mockInvestmentData.map((record) => (
              <div
                key={record.id}
                className="p-5 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded ${getZoneColor(record.zone)}`}
                      >
                        {getZoneLabel(record.zone)}
                      </span>
                      {record.status === "ongoing" && (
                        <span className="text-xs font-medium px-2.5 py-1 rounded bg-green-100 text-green-700">
                          투자중
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                      <Calendar className="w-4 h-4" />
                      <span>{record.date}</span>
                    </div>

                    {record.theme && (
                      <p className="text-sm text-gray-700">
                        테마:{" "}
                        <span className="font-medium">{record.theme}</span>
                      </p>
                    )}

                    {record.ratio && (
                      <p className="text-sm text-gray-700">
                        투자 비율:{" "}
                        <span className="font-medium">
                          익스트림 {record.ratio}% · 이자 {100 - record.ratio}%
                        </span>
                      </p>
                    )}
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-gray-600 mb-1">투자금</p>
                    <p className="text-lg font-semibold text-gray-900 mb-2">
                      {record.principal.toLocaleString()}원
                    </p>

                    <div className="flex items-center justify-end gap-2">
                      {record.profit >= 0 ? (
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-600" />
                      )}
                      <div className="text-right">
                        <p
                          className={`font-semibold ${record.profit >= 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          {record.profit >= 0 ? "+" : ""}
                          {record.profit.toLocaleString()}원
                        </p>
                        <p
                          className={`text-sm ${record.returnRate >= 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          {record.returnRate >= 0 ? "+" : ""}
                          {record.returnRate}%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Empty State (if needed) */}
        {mockInvestmentData.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              투자 내역이 없습니다
            </h3>
            <p className="text-sm text-gray-600">
              존을 선택하여 투자를 시작해보세요
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
