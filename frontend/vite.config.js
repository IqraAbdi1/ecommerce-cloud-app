import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api/auth': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (path) => path.replace('/api/auth', '/auth')
      },
      '/api/products': {
        target: 'http://localhost:3002',
        changeOrigin: true,
        rewrite: (path) => path.replace('/api/products', '/products')
      },
      '/api/orders': {
        target: 'http://localhost:3003',
        changeOrigin: true,
        rewrite: (path) => path.replace('/api/orders', '/orders')
      },
      '/api/payments': {
        target: 'http://localhost:3004',
        changeOrigin: true,
        rewrite: (path) => path.replace('/api/payments', '/payments')
      }
    }
  }
})