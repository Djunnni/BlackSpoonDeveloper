// ===== API 응답 타입 (서버에서 받는 데이터 구조) =====

export interface UserInMyBoxDto {
  bankCode: string;
  accountNo: string;
  balance: number;
  investBalance: number;
  todayProfit: string; // String으로 넘어옴
  todayInterestAmount: number;
  todayZoneType: "NONE" | "INTEREST" | "INTEREST_WORK" | "POWER_WORK";
  tommorrowZoneType: "NONE" | "INTEREST" | "INTEREST_WORK" | "POWER_WORK";
  selectedRegionCode: string;
  todayPowerWorkType: "NONE" | "SAFE" | "BALANCED" | "ATTACK";
  tomorrowPowerWorkType: "NONE" | "SAFE" | "BALANCED" | "ATTACK";
  selectedRegionName: string;
}

export interface GetUserResponse {
  name: string;
  phone: string;
  UserInMyBoxDto: UserInMyBoxDto;
}

// ===== Native Bridge 타입 =====

export interface AccessTokenInfo {
  accessToken: string;
}

export interface NativeBridgeCallbacks {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

// Native Bridge Window 인터페이스
declare global {
  interface Window {
    webkit?: {
      messageHandlers?: {
        BlackSpoonDevHandler?: {
          postMessage?: (data: any) => void;
        };
      };
    };
    BlackSpoonDevHandler?: {
      postMessage?: (data: string) => void;
    };
    // Native Bridge 콜백 저장소
    nativeBridgeCallbacks?: Map<string, NativeBridgeCallbacks>;
  }
}
