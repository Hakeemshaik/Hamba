/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Supabase project URL — set to enable the cloud database. */
  readonly VITE_SUPABASE_URL?: string
  /** Supabase anon (public) key — safe to ship in the frontend. */
  readonly VITE_SUPABASE_ANON_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
