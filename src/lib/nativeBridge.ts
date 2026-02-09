// src/lib/native/nativeBridge.ts

export type NativeTabIndex = 0 | 1 | 2 | 3 | 4 | 5;

interface NativeMessage {
  type: string;
  [key: string]: any;
}

declare global {
  interface Window {
    webkit?: {
      messageHandlers?: {
        BlackSpoonDevHandler?: {
          postMessage: (message: NativeMessage) => void;
        };
      };
    };
    BlackSpoonDevHandler?: {
      postMessage: (message: string) => void;
    };
  }
}

const isIOS = () =>
  typeof window !== "undefined" &&
  !!window.webkit?.messageHandlers?.BlackSpoonDevHandler;

const isAndroid = () =>
  typeof window !== "undefined" &&
  !!window.BlackSpoonDevHandler?.postMessage;

const postToNative = (payload: NativeMessage) => {
  try {
    if (isIOS()) {
      window.webkit!.messageHandlers!.BlackSpoonDevHandler!.postMessage(payload);
      return;
    }

    if (isAndroid()) {
      window.BlackSpoonDevHandler!.postMessage(JSON.stringify(payload));
      return;
    }

    // Web fallback (개발용)
    console.info("[NativeBridge] (web)", payload);
  } catch (e) {
    console.error("[NativeBridge] post failed", e, payload);
  }
};

// ✅ AccessToken Promise 관리
let tokenPromiseResolver: ((token: string) => void) | null = null;
let tokenPromiseRejector: ((error: Error) => void) | null = null;

// ✅ iOS에서 accessTokenInfo 메시지를 받을 전역 핸들러
if (typeof window !== "undefined") {
  (window as any).handleAccessTokenInfo = (data: any) => {
    console.log('[NativeBridge] handleAccessTokenInfo called with:', data);
    
    if (tokenPromiseResolver) {
      // iOS 응답 형태: { accessToken: "..." } 또는 { data: { accessToken: "..." } }
      const token = data?.accessToken || data?.data?.accessToken;
      
      if (token) {
        console.log('[NativeBridge] ✅ Token resolved:', token);
        tokenPromiseResolver(token);
        tokenPromiseResolver = null;
        tokenPromiseRejector = null;
      } else if (tokenPromiseRejector) {
        console.error('[NativeBridge] ❌ Invalid token data:', data);
        tokenPromiseRejector(new Error("Invalid accessToken response"));
        tokenPromiseResolver = null;
        tokenPromiseRejector = null;
      }
    } else {
      console.warn('[NativeBridge] ⚠️ No resolver waiting for token');
    }
  };
}

export const NativeBridge = {
  moveTab(tab: NativeTabIndex, message?: string) {
    const payload: NativeMessage = {
      type: "moveTab",
      tab,
      message: message ?? "hello from web",
      ts: Date.now(),
    };
    postToNative(payload);
  },

  // ✅ AccessToken 요청 (Promise 반환)
  requestAccessToken(): Promise<string> {
    return new Promise((resolve, reject) => {
      const timeout = 5000;

      // 타임아웃 설정
      const timeoutId = setTimeout(() => {
        if (tokenPromiseRejector) {
          tokenPromiseRejector(new Error("AccessToken request timeout"));
          tokenPromiseResolver = null;
          tokenPromiseRejector = null;
        }
      }, timeout);

      // Promise resolver 저장
      tokenPromiseResolver = (token: string) => {
        clearTimeout(timeoutId);
        resolve(token);
      };
      
      tokenPromiseRejector = (error: Error) => {
        clearTimeout(timeoutId);
        reject(error);
      };

      // Native에 요청 전송
      const payload: NativeMessage = {
        type: "accessTokenInfo",
        ts: Date.now(),
      };
      postToNative(payload);
      
      console.log('[NativeBridge] Requested accessTokenInfo');
    });
  },

  // ✅ Settings Bottom 숨김 요청
  hideSettingBottom(message?: string) {
    const payload: NativeMessage = {
      type: "hideSettingBottom",
      message: message ?? "hide bottom from settings",
      ts: Date.now(),
    };
    postToNative(payload);
  },

  // (옵션) 다시 보이게 만들고 싶으면
  showSettingBottom(message?: string) {
    const payload: NativeMessage = {
      type: "showSettingBottom",
      message: message ?? "show bottom from settings",
      ts: Date.now(),
    };
    postToNative(payload);
  },
};
