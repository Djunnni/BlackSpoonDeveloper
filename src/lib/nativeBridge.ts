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
