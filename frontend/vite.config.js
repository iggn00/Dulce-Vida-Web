import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'


const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const target = env.VITE_API_URL || 'http://localhost:8080'
  const outDir = path.resolve(__dirname, '../backend/src/main/resources/static')
  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': { target, changeOrigin: true }
      }
    },
    build: {
      outDir,
      emptyOutDir: true
    }
    test: {
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.js']
    }
  }
})
