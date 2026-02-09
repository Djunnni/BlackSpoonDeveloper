import type { GetUserResponse, AccessTokenInfo } from './api-types';
import { requestAccessToken, isNativeBridgeAvailable } from '../utils/native-bridge';

// API 베이스 URL
const API_BASE_URL = 'https://blackspoondev-sandbox.mxapps.io/rest/apiservice/v1';

// 개발 모드 플래그 (환경변수나 설정으로 변경 가능)
const DEV_MODE = import.meta.env.VITE_USE_MOCK_API !== 'false';

// Native Bridge에서 accessToken 가져오기
let cachedAccessToken: string | null = null;

/**
 * Native Bridge를 통해 accessToken을 요청하고 받아옵니다.
 * 콜백 ID: tokenInfo
 */
export async function getAccessTokenFromNative(): Promise<string> {
  // 캐시된 토큰이 있으면 반환
  if (cachedAccessToken) {
    return cachedAccessToken;
  }

  // Native Bridge 사용 가능 여부 확인
  if (!isNativeBridgeAvailable()) {
    throw new Error('Native Bridge is not available');
  }

  try {
    const token = await requestAccessToken();
    cachedAccessToken = token;
    return token;
  } catch (error) {
    console.error('Failed to get accessToken from Native:', error);
    throw error;
  }
}

/**
 * accessToken 캐시 초기화 (로그아웃 시 호출)
 */
export function clearAccessToken() {
  cachedAccessToken = null;
}

/**
 * GET /user - 사용자 정보 조회
 * @param myBoxAccountNo - 계좌번호 (숫자)
 */
export async function getUserInfo(myBoxAccountNo: string): Promise<GetUserResponse> {
  // 개발 모드: Mock 데이터 반환
  if (DEV_MODE) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          name: "이동준",
          phone: "01012341234",
          UserInMyBoxDto: {
            bankCode: "037",
            accountNo: "1068011596267",
            balance: 80000000,
            investBalance: 6800000,
            todayProfit: "+8.50",
            todayInterestAmount: 0,
            todayZoneType: "INTEREST",
            tommorrowZoneType: "INTEREST",
            selectedRegionCode: "35510",
            todayPowerWorkType: "NONE",
            tomorrowPowerWorkType: "NONE",
            selectedRegionName: "전북 전주시 덕진구"
          }
        });
      }, 500); // 네트워크 딜레이 시뮬레이션
    });
  }

  try {
    // Native Bridge에서 accessToken 가져오기
    const accessToken = await getAccessTokenFromNative();

    // API 호출
    const url = `${API_BASE_URL}/user?myBoxAccountNo=${encodeURIComponent(myBoxAccountNo)}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data: GetUserResponse = await response.json();
    return data;
  } catch (error) {
    console.error('getUserInfo failed:', error);
    throw error;
  }
}

/**
 * 개발 모드 토글 함수 (디버깅용)
 */
export function setDevMode(enabled: boolean) {
  localStorage.setItem('VITE_USE_MOCK_API', enabled ? 'true' : 'false');
  window.location.reload();
}
