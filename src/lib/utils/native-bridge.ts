/**
 * Native Bridge 유틸리티
 * iOS/Android 네이티브 앱과 웹뷰 간 통신을 위한 헬퍼 함수들
 */

export interface NativeMessage {
  type: string;
  [key: string]: any;
}

/**
 * Native Bridge로 메시지 전송
 */
export function sendToNative(message: NativeMessage): void {
  try {
    // iOS WebKit
    (window as any).webkit?.messageHandlers?.BlackSpoonDevHandler?.postMessage?.(message);
    
    // Android
    (window as any).BlackSpoonDevHandler?.postMessage?.(JSON.stringify(message));
    
    console.log('📤 Sent to Native:', message);
  } catch (error) {
    console.error('❌ Failed to send to Native:', error);
  }
}

/**
 * Native에서 메시지 수신 (콜백 등록)
 */
export function onNativeMessage(
  callbackId: string,
  handler: (data: any) => void,
  timeout: number = 5000
): () => void {
  // 타임아웃 설정
  const timeoutId = setTimeout(() => {
    console.warn(`⏱️ Native callback timeout: ${callbackId}`);
    cleanup();
  }, timeout);

  // 콜백 등록
  (window as any)[callbackId] = (data: any) => {
    clearTimeout(timeoutId);
    console.log(`📥 Received from Native (${callbackId}):`, data);
    handler(data);
    cleanup();
  };

  // 정리 함수
  const cleanup = () => {
    delete (window as any)[callbackId];
    clearTimeout(timeoutId);
  };

  // 정리 함수 반환 (cleanup용)
  return cleanup;
}

/**
 * 탭 이동 요청
 * @param tab 0: 홈, 1: 지역, 2: 분석, 3: 분석, 4: AI상담사, 5: 설정
 */
export function requestMoveTab(tab: 0 | 1 | 2 | 3 | 4 | 5, message?: string): void {
  sendToNative({
    type: 'moveTab',
    tab,
    message: message ?? 'hello from web',
    ts: Date.now(),
  });
}

/**
 * AccessToken 요청
 */
export function requestAccessToken(): Promise<string> {
  return new Promise((resolve, reject) => {
    const cleanup = onNativeMessage(
      'tokenInfo',
      (data) => {
        if (data && data.accessToken) {
          resolve(data.accessToken);
        } else {
          reject(new Error('Invalid accessToken response'));
        }
      },
      5000
    );

    // 요청 전송
    sendToNative({
      type: 'accessTokenInfo',
      callbackId: 'tokenInfo',
      ts: Date.now(),
    });

    // 실패 시 cleanup
    setTimeout(() => {
      cleanup();
      reject(new Error('AccessToken request timeout'));
    }, 5000);
  });
}

/**
 * 지역 선택 완료 알림
 */
export function notifyRegionSelected(regionCode: string, regionName: string): void {
  sendToNative({
    type: 'regionSelected',
    regionCode,
    regionName,
    ts: Date.now(),
  });
}

/**
 * Native Bridge 사용 가능 여부 확인
 */
export function isNativeBridgeAvailable(): boolean {
  return !!(
    (window as any).webkit?.messageHandlers?.BlackSpoonDevHandler ||
    (window as any).BlackSpoonDevHandler
  );
}

/**
 * 플랫폼 감지
 */
export function detectPlatform(): 'ios' | 'android' | 'web' {
  if ((window as any).webkit?.messageHandlers?.BlackSpoonDevHandler) {
    return 'ios';
  }
  if ((window as any).BlackSpoonDevHandler) {
    return 'android';
  }
  return 'web';
}
