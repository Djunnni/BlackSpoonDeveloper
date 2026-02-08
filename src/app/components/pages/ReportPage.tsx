import { useEffect } from 'react';
import { Layout } from '../Layout';
import { TrendingUp, DollarSign, Target, Clock, Award } from 'lucide-react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useInvestmentStore } from '../../../lib/stores/investmentStore';
import { useAccountStore } from '../../../lib/stores/accountStore';

// 연 1.2% 기준 일 이자 계산
const ANNUAL_INTEREST_RATE = 1.2; // 연 1.2%
const DAILY_INTEREST_RATE = ANNUAL_INTEREST_RATE / 365; // 일 이자율
const PRINCIPAL = 10000000; // 원금 1천만원
const DAILY_INTEREST = Math.floor(PRINCIPAL * (DAILY_INTEREST_RATE / 100)); // 일 이자 약 329원

export function ReportPage() {
  const { records, ranking, fetchInvestmentRecords, fetchRegionalRanking, isLoading } = useInvestmentStore();
  const { account } = useAccountStore();

  // 데이터 로드
  useEffect(() => {
    fetchInvestmentRecords();
    fetchRegionalRanking();
  }, [fetchInvestmentRecords, fetchRegionalRanking]);

  // 통계 계산
  const totalInvested = records.reduce((sum, record) => sum + record.investedAmount, 0);
  const totalProfit = records.reduce((sum, record) => sum + record.profit, 0);
  const avgReturn = totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0;
  const positiveRecords = records.filter(r => r.profit > 0).length;
  const winRate = records.length > 0 ? (positiveRecords / records.length) * 100 : 0;

  // Calculate cumulative profit data for chart
  const sortedData = [...records].sort((a, b) => a.date.localeCompare(b.date));

  let cumulativeActual = 0;
  let cumulativeInterestOnly = 0;

  const chartData = sortedData.map((record) => {
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
    if (zone === "extreme") return "bg-red-100 text-red-700";
    return "bg-purple-100 text-purple-700";
  };

  // 로딩 중
  if (isLoading && records.length === 0) {
    return (
      <Layout>
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">투자 내역을 불러오는 중...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            투자 분석
          </h1>
          <p className="text-sm text-gray-600">
            투자 내역과 수익률을 확인하세요
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
          {/* Regional Ranking - 모바일에서 한 줄 차지 */}
          {ranking && (
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 sm:p-5 border border-blue-600 col-span-2 lg:col-span-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
                <div className="p-2 bg-white/20 rounded-lg w-fit">
                  <Award className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <p className="text-xs sm:text-sm text-blue-50">
                  지역 내 순위
                </p>
              </div>
              <p className="text-lg sm:text-2xl font-bold text-white mb-1">
                상위 {(100 - ranking.percentile).toFixed(1)}%
              </p>
              <p className="text-xs text-blue-100">
                {ranking.totalUsers.toLocaleString()}명 중{" "}
                {ranking.myRank}위
              </p>
            </div>
          )}

          {/* 총 투자금액 */}
          <div className="bg-white rounded-xl p-4 sm:p-5 border border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
              <div className="p-2 bg-blue-100 rounded-lg w-fit">
                <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              </div>
              <p className="text-xs sm:text-sm text-gray-600">
                총 투자금액
              </p>
            </div>
            <p className="text-lg sm:text-2xl font-bold text-gray-900">
              {totalInvested.toLocaleString()}원
            </p>
          </div>

          {/* 총 수익금 */}
          <div className="bg-white rounded-xl p-4 sm:p-5 border border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
              <div className="p-2 bg-green-100 rounded-lg w-fit">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              </div>
              <p className="text-xs sm:text-sm text-gray-600">
                총 수익금
              </p>
            </div>
            <p
              className={`text-lg sm:text-2xl font-bold ${totalProfit >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              {totalProfit >= 0 ? "+" : ""}
              {totalProfit.toLocaleString()}원
            </p>
          </div>

          {/* 평균 수익률 */}
          <div className="bg-white rounded-xl p-4 sm:p-5 border border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
              <div className="p-2 bg-purple-100 rounded-lg w-fit">
                <Target className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
              </div>
              <p className="text-xs sm:text-sm text-gray-600">
                평균 수익률
              </p>
            </div>
            <p
              className={`text-lg sm:text-2xl font-bold ${avgReturn >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              {avgReturn >= 0 ? "+" : ""}
              {avgReturn.toFixed(2)}%
            </p>
          </div>

          {/* 수익률 */}
          <div className="bg-white rounded-xl p-4 sm:p-5 border border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
              <div className="p-2 bg-orange-100 rounded-lg w-fit">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
              </div>
              <p className="text-xs sm:text-sm text-gray-600">
                수익률
              </p>
            </div>
            <p className="text-lg sm:text-2xl font-bold text-gray-900">
              {winRate.toFixed(0)}%
            </p>
          </div>
        </div>

        {/* Profit Comparison Chart */}
        {chartData.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-gray-900">
                    실제 수익 vs 이자존 예상 수익
                  </h2>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    totalDifference >= 0
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {totalDifference >= 0 ? "+" : ""}
                  {totalDifference.toLocaleString()}원
                </div>
              </div>
              <p className="text-sm text-gray-600">
                이자존으로만 투자했을 때와 비교한 누적 수익 차이
              </p>
            </div>

            <div className="h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="date"
                    stroke="#9ca3af"
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis
                    stroke="#9ca3af"
                    style={{ fontSize: "12px" }}
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                    formatter={(value: number) => `${value.toLocaleString()}원`}
                  />
                  <Legend wrapperStyle={{ fontSize: "12px" }} />
                  <Line
                    type="monotone"
                    dataKey="실제수익"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: "#3b82f6", r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="이자존예상"
                    stroke="#94a3b8"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ fill: "#94a3b8", r: 3 }}
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Investment History */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            투자 내역
          </h2>

          {records.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">아직 투자 내역이 없습니다.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {records.map((record) => (
                <div
                  key={record.id}
                  className="border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`px-2 py-1 rounded-md text-xs font-semibold ${getZoneColor(
                            record.zone
                          )}`}
                        >
                          {getZoneLabel(record.zone)}
                        </span>
                        {record.theme && (
                          <span className="text-xs text-gray-500">
                            {record.theme}
                          </span>
                        )}
                        {record.ratio !== undefined && (
                          <span className="text-xs text-gray-500">
                            {record.ratio}% 투자
                          </span>
                        )}
                        <span className="text-xs text-gray-400">
                          {record.date}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">투자금: </span>
                          <span className="font-semibold text-gray-900">
                            {record.investedAmount.toLocaleString()}원
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-lg font-bold ${
                          record.profit >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {record.profit >= 0 ? "+" : ""}
                        {record.profit.toLocaleString()}원
                      </p>
                      <p
                        className={`text-sm ${
                          record.returnRate >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {record.returnRate >= 0 ? "+" : ""}
                        {record.returnRate.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
