import type { User, Account } from './types';
import type { GetUserResponse, UserInMyBoxDto } from './api-types';

/**
 * API 응답을 앱 내부 타입으로 변환하는 매퍼 함수들
 */

// Zone Type 변환: API -> App
export function mapZoneType(
  apiZoneType: "NONE" | "INTEREST" | "INTEREST_WORK" | "POWER_WORK"
): 'interest' | 'extreme' | 'balance' {
  switch (apiZoneType) {
    case "INTEREST":
      return "interest";
    case "INTEREST_WORK":
      return "extreme";
    case "POWER_WORK":
      return "balance";
    case "NONE":
    default:
      return "interest"; // 기본값
  }
}

// PowerWork 비율 변환: API -> App
export function mapPowerWorkRatio(
  apiRatio: "NONE" | "SAFE" | "BALANCED" | "ATTACK"
): number | undefined {
  switch (apiRatio) {
    case "SAFE":
      return 25;
    case "BALANCED":
      return 50;
    case "ATTACK":
      return 75;
    case "NONE":
    default:
      return undefined;
  }
}

// Zone Type 변환: App -> API
export function mapZoneTypeToApi(
  appZone: 'interest' | 'extreme' | 'balance'
): "INTEREST" | "INTEREST_WORK" | "POWER_WORK" {
  switch (appZone) {
    case "interest":
      return "INTEREST";
    case "extreme":
      return "INTEREST_WORK";
    case "balance":
      return "POWER_WORK";
  }
}

// PowerWork 비율 변환: App -> API
export function mapPowerWorkRatioToApi(
  appRatio?: number
): "NONE" | "SAFE" | "BALANCED" | "ATTACK" {
  switch (appRatio) {
    case 25:
      return "SAFE";
    case 50:
      return "BALANCED";
    case 75:
      return "ATTACK";
    default:
      return "NONE";
  }
}

// API 응답 -> User 타입 변환
export function mapApiResponseToUser(response: GetUserResponse): User {
  return {
    id: response.UserInMyBoxDto.accountNo, // 계좌번호를 ID로 사용
    name: response.name,
    email: '', // API 응답에 없음
    phoneNumber: response.phone,
    regionCode: response.UserInMyBoxDto.selectedRegionCode,
    regionName: response.UserInMyBoxDto.selectedRegionName,
    createdAt: new Date().toISOString(), // API 응답에 없음
  };
}

// API 응답 -> Account 타입 변환
export function mapApiResponseToAccount(response: GetUserResponse): Account {
  const dto = response.UserInMyBoxDto;
  
  // 계좌번호 포맷: 123-456-789012 (13자리를 3-3-6 형식으로)
  // 예: 1068011596267 -> 106-801-1596267
  let formattedAccountNo = dto.accountNo;
  if (dto.accountNo && dto.accountNo.length >= 12) {
    formattedAccountNo = dto.accountNo.replace(/(\d{3})(\d{3})(\d+)/, '$1-$2-$3');
  }
  
  return {
    accountId: `${dto.bankCode}-${dto.accountNo}`, // 은행코드-계좌번호 형식
    accountNo: formattedAccountNo, // 포맷된 계좌번호
    balance: dto.balance,
    investBalance: dto.investBalance,
    todayInterest: dto.todayInterestAmount,
    todayProfit: dto.todayProfit, // String 그대로 사용 (+8.50 형식)
    totalInterest: dto.todayInterestAmount, // API에 누적 이자가 없어서 임시로 오늘 이자 사용
    dailyReturnRate: 0, // 계산 필요
    currentZone: mapZoneType(dto.todayZoneType),
    nextZone: mapZoneType(dto.tommorrowZoneType),
    extremeTheme: undefined, // API 응답에 없음 (추후 확장)
    balanceRatio: mapPowerWorkRatio(dto.todayPowerWorkType),
    currentBalanceRatio: mapPowerWorkRatio(dto.todayPowerWorkType),
    nextBalanceRatio: mapPowerWorkRatio(dto.tomorrowPowerWorkType),
  };
}
