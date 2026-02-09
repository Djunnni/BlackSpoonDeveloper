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
      const callbackId = "tokenInfo";
      const timeout = 5000;

      // 타임아웃 설정
      const timeoutId = setTimeout(() => {
        delete (window as any)[callbackId];
        reject(new Error("AccessToken request timeout"));
      }, timeout);

      // 콜백 등록
      (window as any)[callbackId] = (data: any) => {
        clearTimeout(timeoutId);
        delete (window as any)[callbackId];
        
        if (data && data.accessToken) {
          resolve(data.accessToken);
        } else {
          reject(new Error("Invalid accessToken response"));
        }
      };

      // Native에 요청 전송
      const payload: NativeMessage = {
        type: "accessTokenInfo",
        callbackId: callbackId,
        ts: Date.now(),
      };
      postToNative(payload);
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
