/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE: string
  readonly VITE_DISCORD_BOT_TOKEN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
