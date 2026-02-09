/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_USE_MOCK_API: string;
  readonly VITE_MYBOX_ACCOUNT_NO: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
