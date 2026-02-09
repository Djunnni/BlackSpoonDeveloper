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
 * accessToken을 Native Bridge에서 받아서 myBoxAccountNo 파라미터로 사용
 */
export async function getUserInfo(): Promise<GetUserResponse> {
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
    console.log('[API] Got accessToken from Native:', accessToken);

    // API 호출 - accessToken을 myBoxAccountNo로 사용
    const url = `${API_BASE_URL}/user?myBoxAccountNo=${encodeURIComponent(accessToken)}`;
    console.log('[API] Calling:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('[API] Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[API] Error response:', errorText);
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data: GetUserResponse = await response.json();
    console.log('[API] User data received:', data);
    return data;
  } catch (error) {
    console.error('[API] getUserInfo failed:', error);
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
