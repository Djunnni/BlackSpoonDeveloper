import { Layout } from "../Layout";
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
  Target,
  Clock,
  LineChart,
  Users,
  Award,
} from "lucide-react";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface InvestmentRecord {
  id: string;
  date: string;
  zone: "interest" | "extreme" | "balance";
  theme?: string;
  ratio?: number;
  principal: number; // 원금 (항상 10,000,000)
  investedAmount: number; // 실제 투자에 사용된 금액 (이자 기반)
  profit: number; // 투자금 대비 수익
  returnRate: number; // 투자금 대비 수익률
  status: "completed" | "ongoing";
}

// 연 1.2% 기준 일 이자 계산
const ANNUAL_INTEREST_RATE = 1.2; // 연 1.2%
const DAILY_INTEREST_RATE = ANNUAL_INTEREST_RATE / 365; // 일 이자율
const PRINCIPAL = 10000000; // 원금 1천만원
const DAILY_INTEREST = Math.floor(PRINCIPAL * (DAILY_INTEREST_RATE / 100)); // 일 이자 약 329원

const mockInvestmentData: InvestmentRecord[] = [
  {
    id: "1",
    date: "2026-02-06",
    zone: "extreme",
    theme: "미국 테크",
    principal: PRINCIPAL,
    investedAmount: DAILY_INTEREST,
    profit: 105, // 이자 329원으로 32% 수익
    returnRate: 32.0,
    status: "ongoing",
  },
  {
    id: "2",
    date: "2026-02-05",
    zone: "extreme",
    theme: "AI/클라우드",
    principal: PRINCIPAL,
    investedAmount: DAILY_INTEREST,
    profit: 76, // 이자 329원으로 23% 수익
    returnRate: 23.1,
    status: "completed",
  },
  {
    id: "3",
    date: "2026-02-04",
    zone: "balance",
    ratio: 50,
    principal: PRINCIPAL,
    investedAmount: DAILY_INTEREST + Math.floor(PRINCIPAL * 0.5), // 이자 + 원금 50%
    profit: 90150, // 5,000,329원으로 1.8% 수익
    returnRate: 1.8,
    status: "completed",
  },
  {
    id: "4",
    date: "2026-02-03",
    zone: "interest",
    principal: PRINCIPAL,
    investedAmount: PRINCIPAL, // 이자존은 원금 전체
    profit: DAILY_INTEREST, // 일 이자
    returnRate: DAILY_INTEREST_RATE,
    status: "completed",
  },
  {
    id: "5",
    date: "2026-02-02",
    zone: "extreme",
    theme: "반도체",
    principal: PRINCIPAL,
    investedAmount: DAILY_INTEREST,
    profit: -98, // 이자 329원으로 -29.8% 손실
    returnRate: -29.8,
    status: "completed",
  },
  {
    id: "6",
    date: "2026-02-01",
    zone: "balance",
    ratio: 25,
    principal: PRINCIPAL,
    investedAmount: DAILY_INTEREST + Math.floor(PRINCIPAL * 0.25), // 이자 + 원금 25%
    profit: 30100, // 2,500,329원으로 1.2% 수익
    returnRate: 1.2,
    status: "completed",
  },
];

export function ReportPage() {
  const totalInvested = mockInvestmentData.reduce(
    (sum, record) => sum + record.investedAmount,
    0,
  );
  const totalProfit = mockInvestmentData.reduce(
    (sum, record) => sum + record.profit,
    0,
  );
  const avgReturn = totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0;
  const positiveRecords = mockInvestmentData.filter((r) => r.profit > 0).length;
  const winRate = (positiveRecords / mockInvestmentData.length) * 100;

  // 지역 내 순위 (mock data)
  const regionalRanking = {
    totalUsers: 1247,
    myRank: 89,
    percentile: 92.9, // 상위 7.1%
  };

  // Calculate cumulative profit data for chart
  const sortedData = [...mockInvestmentData].sort((a, b) =>
    a.date.localeCompare(b.date),
  );

  let cumulativeActual = 0;
  let cumulativeInterestOnly = 0;

  const chartData = sortedData.map((record, index) => {
    cumulativeActual += record.profit;
    // 이자존으로만 했을 경우 예상 수익 (매일 일정한 이자)
    cumulativeInterestOnly += DAILY_INTEREST;

    return {
      date: record.date.substring(5), // MM-DD format
      실제수익: Math.floor(cumulativeActual), // 원 단위
      이자존예상: Math.floor(cumulativeInterestOnly), // 원 단위
      차이: Math.floor(cumulativeActual - cumulativeInterestOnly),
    };
  });

  const totalDifference = totalProfit - cumulativeInterestOnly;

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

  const getInvestmentDescription = (record: InvestmentRecord) => {
    if (record.zone === "interest") {
      return `원금 ${record.principal.toLocaleString()}원`;
    } else if (record.zone === "extreme") {
      return `발생 이자 ${record.investedAmount.toLocaleString()}원`;
    } else {
      const principalAmount = record.investedAmount - DAILY_INTEREST;
      return `이자 ${DAILY_INTEREST.toLocaleString()}원 + 원금 ${principalAmount.toLocaleString()}원`;
    }
  };

  return (
    <Layout>
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6 ">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 sm:p-5 border border-blue-600 col-span-2 lg:col-span-1 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
            <div className="p-2 bg-white/20 rounded-lg w-fit">
              <Award className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <p className="text-xs sm:text-sm text-blue-50">지역 내 순위</p>
          </div>
          <p className="text-lg sm:text-2xl font-bold text-white mb-1">
            상위 {(100 - regionalRanking.percentile).toFixed(1)}%
          </p>
          <p className="text-xs text-blue-100">
            {regionalRanking.totalUsers.toLocaleString()}명 중{" "}
            {regionalRanking.myRank}위
          </p>
        </div>
        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 sm:p-5 border border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
              <div className="p-2 bg-blue-100 rounded-lg w-fit">
                <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              </div>
              <p className="text-xs sm:text-sm text-gray-600">총 투자금액</p>
            </div>
            <p className="text-lg sm:text-2xl font-bold text-gray-900">
              {totalInvested.toLocaleString()}원
            </p>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-5 border border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
              <div className="p-2 bg-green-100 rounded-lg w-fit">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              </div>
              <p className="text-xs sm:text-sm text-gray-600">총 수익금</p>
            </div>
            <p
              className={`text-lg sm:text-2xl font-bold ${totalProfit >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              {totalProfit >= 0 ? "+" : ""}
              {totalProfit.toLocaleString()}원
            </p>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-5 border border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
              <div className="p-2 bg-purple-100 rounded-lg w-fit">
                <Target className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
              </div>
              <p className="text-xs sm:text-sm text-gray-600">평균 수익률</p>
            </div>
            <p
              className={`text-lg sm:text-2xl font-bold ${avgReturn >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              {avgReturn >= 0 ? "+" : ""}
              {avgReturn.toFixed(2)}%
            </p>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-5 border border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
              <div className="p-2 bg-orange-100 rounded-lg w-fit">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
              </div>
              <p className="text-xs sm:text-sm text-gray-600">수익률</p>
            </div>
            <p className="text-lg sm:text-2xl font-bold text-gray-900">
              {winRate.toFixed(0)}%
            </p>
          </div>
        </div>

        {/* Profit Comparison Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <LineChart className="w-5 h-5 text-gray-700" />
                <h2 className="font-semibold text-gray-900">수익 비교</h2>
              </div>
              <div
                className={`text-sm font-semibold ${totalDifference >= 0 ? "text-green-600" : "text-red-600"}`}
              >
                {totalDifference >= 0 ? "+" : ""}
                {totalDifference.toLocaleString()}원{" "}
                {totalDifference >= 0 ? "더 벌었어요" : "손해"}
              </div>
            </div>
            <p className="text-sm text-gray-600">이자존으로만 했을 때와 비교</p>
          </div>

          <div className="w-full h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 10,
                  left: 0,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  stroke="#9ca3af"
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  stroke="#9ca3af"
                  label={{
                    value: "(원)",
                    position: "insideTop",
                    offset: 10,
                    fontSize: 11,
                    fill: "#6b7280",
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: "13px",
                  }}
                  formatter={(value: number) => `${value.toLocaleString()}원`}
                />
                <Legend wrapperStyle={{ fontSize: "13px" }} iconType="line" />
                <Line
                  type="monotone"
                  dataKey="실제수익"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#3b82f6" }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="이자존예상"
                  stroke="#94a3b8"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ r: 3, fill: "#94a3b8" }}
                />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200">
            <div>
              <p className="text-xs text-gray-600 mb-1">누적 실제 수익</p>
              <p
                className={`font-semibold ${totalProfit >= 0 ? "text-blue-600" : "text-red-600"}`}
              >
                {totalProfit >= 0 ? "+" : ""}
                {totalProfit.toLocaleString()}원
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">이자존 예상 수익</p>
              <p className="font-semibold text-gray-600">
                +{cumulativeInterestOnly.toLocaleString()}원
              </p>
            </div>
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
                      <p className="text-sm text-gray-700 mb-1">
                        테마:{" "}
                        <span className="font-medium">{record.theme}</span>
                      </p>
                    )}

                    <p className="text-sm text-gray-700">
                      투자금:{" "}
                      <span className="font-medium">
                        {getInvestmentDescription(record)}
                      </span>
                    </p>

                    {record.ratio && (
                      <p className="text-xs text-gray-500 mt-1">
                        비율: 익스트림 {record.ratio}% · 이자{" "}
                        {100 - record.ratio}%
                      </p>
                    )}
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-gray-600 mb-1">투자금</p>
                    <p className="text-lg font-semibold text-gray-900 mb-2">
                      {record.investedAmount.toLocaleString()}원
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
                          {record.returnRate.toFixed(2)}%
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
