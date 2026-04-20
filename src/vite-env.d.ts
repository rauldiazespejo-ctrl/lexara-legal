/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPERADMIN_EMAILS?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
