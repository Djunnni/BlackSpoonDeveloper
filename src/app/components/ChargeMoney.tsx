import { useState } from "react";
import { ArrowRight, Check, Wallet, Building2 } from "lucide-react";
import { HistoryBackButton } from "../components/HistoryBackButton";


export function ChargeMoney() {
  const [step, setStep] = useState<"input" | "complete">("input");
  const [amount, setAmount] = useState("");

  const quickAmounts = [10000, 50000, 100000, 500000, 1000000];

  const handleQuickAmount = (value: number) => {
    setAmount(value.toString());
  };

  const handleCharge = () => {
    if (amount && parseInt(amount) > 0) {
      setStep("complete");
      setTimeout(() => {
        setStep("input");
        setAmount("");
      }, 3000);
    }
  };

  if (step === "complete") {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-6">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <Check className="w-10 h-10 text-green-600" />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          충전이 완료되었습니다
        </h2>
        <p className="text-gray-600 mb-8">
          JB머니 금고에 {parseInt(amount).toLocaleString()}원이 입금되었습니다
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 🔙 뒤로가기 */}
      <HistoryBackButton />

      {/* 타이틀 */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          JB머니 금고 충전
        </h2>
        <p className="text-sm text-gray-600">
          JB계좌에서 JB머니 금고로 금액을 이체합니다
        </p>
      </div>

      {/* 계좌 정보 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Building2 className="w-5 h-5 text-gray-700" />
            <span className="text-sm text-gray-700">출금 계좌</span>
          </div>
          <p className="font-semibold text-gray-900">JB 입출금 계좌</p>
          <p className="text-sm text-gray-600 mt-1">잔액: 25,340,000원</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 text-white">
          <div className="flex items-center gap-2 mb-3">
            <Wallet className="w-5 h-5" />
            <span className="text-sm text-blue-100">입금 금고</span>
          </div>
          <p className="font-semibold">JB머니 금고</p>
          <p className="text-sm text-blue-100 mt-1">잔액: 15,750,000원</p>
        </div>
      </div>

      {/* 금액 입력 */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          충전 금액
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="금액을 입력하세요"
          className="w-full px-4 py-4 text-2xl font-bold text-gray-900 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
        />

        <div className="mt-4 grid grid-cols-3 gap-2">
          {quickAmounts.map((value) => (
            <button
              key={value}
              onClick={() => handleQuickAmount(value)}
              className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium text-gray-700 transition-colors"
            >
              +{value / 10000}만원
            </button>
          ))}
        </div>
      </div>

      {/* 충전 버튼 */}
      <button
        onClick={handleCharge}
        disabled={!amount || parseInt(amount) <= 0}
        className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
      >
        <span>충전하기</span>
        <ArrowRight className="w-5 h-5" />
      </button>

      {/* 안내사항 */}
      <div className="bg-blue-50 rounded-xl p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">
          충전 안내
        </h4>
        <ul className="space-y-1 text-xs text-blue-700">
          <li>• 최소 충전 금액: 10,000원</li>
          <li>• 수수료: 무료</li>
          <li>• 충전 즉시 JB머니 금고에 반영됩니다</li>
          <li>• JB머니는 언제든지 JB계좌로 출금 가능합니다</li>
        </ul>
      </div>
    </div>
  );
}
