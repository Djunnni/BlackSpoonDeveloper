// components/HistoryBackButton.tsx
import { ArrowLeft } from "lucide-react";

export function HistoryBackButton() {
  const handleBack = () => {
    window.history.back();
  };

  return (
    <button
      onClick={handleBack}
      className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
    >
      <ArrowLeft className="w-4 h-4" />
      <span>뒤로가기</span>
    </button>
  );
}
