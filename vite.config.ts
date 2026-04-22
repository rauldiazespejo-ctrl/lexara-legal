import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

/** En GitHub Actions, activar con VITE_GH_PAGES=1 (subpath /repo/). */
const useGhPagesBase = process.env.VITE_GH_PAGES === '1'
const repo = useGhPagesBase ? process.env.GITHUB_REPOSITORY?.split('/')[1] : undefined
const base = repo ? `/${repo}/` : '/'

/** Build de app de escritorio (Tauri) — sin PWA; base siempre /. */
const isTauri = process.env.VITE_TAURI === '1'

const host = process.env.TAURI_DEV_HOST

export default defineConfig({
  base,
  clearScreen: false,
  envPrefix: ['VITE_', 'TAURI_'],
  plugins: [
    react(),
    tailwindcss(),
    ...(isTauri
      ? []
      : [
          VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['lexara-logo.svg', 'lexara-logo.png', 'robots.txt'],
            workbox: {
              /** Bundle principal > 2 MiB; sin esto el SW no se genera. */
              maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
              globPatterns: ['**/*.{js,css,html,ico,svg,png,webmanifest,woff2,woff}'],
              runtimeCaching: [
                {
                  urlPattern: ({ url }) =>
                    url.origin === 'https://fonts.googleapis.com' ||
                    url.origin === 'https://fonts.gstatic.com',
                  handler: 'CacheFirst' as const,
                  options: {
                    cacheName: 'google-fonts-lexara',
                    expiration: { maxEntries: 32, maxAgeSeconds: 60 * 60 * 24 * 365 },
                    cacheableResponse: { statuses: [0, 200] },
                  },
                },
              ],
            },
            manifest: (() => {
              const p = base.endsWith('/') ? base : `${base}/`
              return {
                name: 'LEXARA PRO',
                short_name: 'LEXARA',
                description: 'Plataforma legal integral — Chile. IA PulsoAI.',
                start_url: base,
                scope: base,
                display: 'standalone' as const,
                background_color: '#050814',
                theme_color: '#050814',
                lang: 'es-CL',
                categories: ['productivity', 'business', 'legal'],
                icons: [
                  { src: `${p}lexara-logo.png`, sizes: 'any', type: 'image/png', purpose: 'any' },
                  { src: `${p}lexara-logo.svg`, sizes: 'any', type: 'image/svg+xml' },
                ],
              }
            })(),
          }),
        ]),
  ],
  server: {
    host: host || '0.0.0.0',
    port: 5173,
    strictPort: true,
    hmr: host ? { protocol: 'ws' as const, host, port: 1420 } : undefined,
    // Z.AI: CORS; mismo origen en dev
    proxy: {
      '/api/zai': {
        target: 'https://api.z.ai',
        changeOrigin: true,
        secure: true,
        rewrite: p => p.replace(/^\/api\/zai/, '/api/paas/v4'),
      },
    },
    watch: { ignored: ['**/src-tauri/**'] },
  },
})
