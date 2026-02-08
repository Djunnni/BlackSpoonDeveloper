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

export const NativeBridge = {
  moveTab(tab: NativeTabIndex, message?: string) {
    const payload = {
      type: "moveTab",
      tab,
      message: message ?? "hello from web",
      ts: Date.now(),
    };

    try {
      if (isIOS()) {
        window.webkit!.messageHandlers!.BlackSpoonDevHandler!.postMessage(
          payload,
        );
        return;
      }

      if (isAndroid()) {
        window.BlackSpoonDevHandler!.postMessage(
          JSON.stringify(payload),
        );
        return;
      }

      // Web fallback (개발용)
      console.info("[NativeBridge] moveTab (web)", payload);
    } catch (e) {
      console.error("[NativeBridge] moveTab failed", e, payload);
    }
  },
};
