import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: true,
    proxy: {
      '/submit': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },
      '/nextMusic': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },
      '/transcription': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
})
