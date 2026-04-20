import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/** En GitHub Actions, GITHUB_REPOSITORY=owner/repo → sitio en /repo/ */
const repo = process.env.GITHUB_REPOSITORY?.split('/')[1]
const base = repo ? `/${repo}/` : '/'

export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      // Z.AI no expone CORS al navegador; proxy mismo origen → api.z.ai
      '/api/zai': {
        target: 'https://api.z.ai',
        changeOrigin: true,
        secure: true,
        rewrite: path => path.replace(/^\/api\/zai/, '/api/paas/v4'),
      },
    },
  },
})
