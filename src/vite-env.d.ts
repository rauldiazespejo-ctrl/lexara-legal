/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  readonly VITE_SUPERADMIN_EMAILS?: string
  /** '1' en build embebido (Tauri); ausente en web. */
  readonly VITE_TAURI?: string
  /** Origen donde vive el proxy /api (p. ej. https://lexara.netlify.app) en app de escritorio compiled. */
  readonly VITE_DESKTOP_API_ORIGIN?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
