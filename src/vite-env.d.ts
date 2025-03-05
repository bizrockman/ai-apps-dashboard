/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FAL_KEY: string;
  readonly VITE_LETTER_PRESS_API_ENDPOINT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
