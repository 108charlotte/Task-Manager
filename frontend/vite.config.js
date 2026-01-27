import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, 
    allowedHosts: ['taskmanager.is-a.software'], 
    proxy: {
      '/authentication': {
        target: 'http://backend:8000',
        changeOrigin: true,
      },
      '/tasks': {
        target: 'http://backend:8000',
        changeOrigin: true,
      },
      '/addtask': {
        target: 'http://backend:8000',
        changeOrigin: true,
      },
      '/deletetask': {
        target: 'http://backend:8000',
        changeOrigin: true,
      },
      '/admin': {
        target: 'http://backend:8000',
        changeOrigin: true,
      }
    }
  }
})
