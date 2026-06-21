import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  optimizeDeps: {
    exclude: ['@platform-system/design-ui'],
  },
  server: {
    port: 5174, // AdminUI runs on 5173, so let's run PaymentUI on 5174
    proxy: {
      '/api': {
        target: 'https://api.nyxoris.com',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
