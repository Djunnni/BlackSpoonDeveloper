import type { GetUserResponse, AccessTokenInfo } from './api-types';
import { requestAccessToken, isNativeBridgeAvailable } from '../utils/native-bridge';

// API 베이스 URL
// const API_BASE_URL = 'https://blackspoondev-sandbox.mxapps.io/rest/apiservice/v1';

// 개발 모드 플래그 (런타임에서 localStorage로 제어 가능)
function isDevMode(): boolean {
  const localStorageValue = localStorage.getItem('VITE_USE_MOCK_API');
  if (localStorageValue !== null) {
    return localStorageValue !== 'false';
  }
  return import.meta.env.VITE_USE_MOCK_API !== 'false';
}

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
  if (isDevMode()) {
    console.log('[API] Using MOCK mode');
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

  // 🧪 디버그 모드: localStorage에 DEBUG_ACCESS_TOKEN이 있으면 사용
  let debugToken = localStorage.getItem('DEBUG_ACCESS_TOKEN');
  
  let accessToken: string;

  if (debugToken) {
    console.log('🧪 [API] Using DEBUG_ACCESS_TOKEN from localStorage:', debugToken);
    accessToken = debugToken;
  } else {
    console.log('aaa')
    // Native Bridge 사용 가능 여부 확인
    if (!isNativeBridgeAvailable()) {
      // Native Bridge가 없으면 자동으로 디버그 토큰 사용
      const fallbackToken = '1068014311315';
      console.warn('⚠️ [API] Native Bridge is not available');
      console.warn('🧪 [API] Using FALLBACK DEBUG TOKEN:', fallbackToken);
      console.warn('💡 [API] To use custom token: localStorage.setItem("DEBUG_ACCESS_TOKEN", "YOUR_TOKEN")');
      
      // 자동으로 localStorage에 저장
      localStorage.setItem('DEBUG_ACCESS_TOKEN', fallbackToken);
      accessToken = fallbackToken;
    } else {
      try {
        // Native Bridge에서 accessToken 가져오기
        console.log('[API] Requesting accessToken from Native Bridge...');
        accessToken = await getAccessTokenFromNative();
        console.log('[API] ✅ Got accessToken from Native:', accessToken);
      } catch (error) {
        console.error('❌ [API] Failed to get accessToken from Native:', error);
        throw error;
      }
    }
  }

  try {
    // API 호출 - accessToken을 myBoxAccountNo로 사용
    const url = `${''}/user?myBoxAccountNo=${encodeURIComponent(accessToken)}&a=a`;
    console.log('🌐 [API] 🚀 Calling HTTP GET:', url);
    console.log('📡 [API] Check Network tab in DevTools!');
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors', // CORS 명시적 설정
    });

    console.log('📥 [API] Response status:', response.status);
    console.log('📥 [API] Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[API] ❌ Error response:', errorText);
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data: GetUserResponse = await response.json();
    console.log('✅ [API] User data received:', data);
    return data;
  } catch (error) {
    console.error('❌ [API] getUserInfo failed:', error);
    
    // 더 자세한 에러 정보
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      console.error('');
      console.error('🔴 NETWORK ERROR DETAILS:');
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.error('This is likely a CORS error or network issue.');
      console.error('');
      console.error('Possible causes:');
      console.error('  1. CORS: Server does not allow cross-origin requests');
      console.error('  2. Network: Server is down or unreachable');
      console.error('  3. URL: Invalid endpoint');
      console.error('');
      console.error('Check DevTools → Network tab for details:');
      console.error(`  - Look for: ${API_BASE_URL}/user`);
      console.error('  - Status: (failed) or (cors error)');
      console.error('  - Response: empty or error message');
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.error('');
    }
    
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
