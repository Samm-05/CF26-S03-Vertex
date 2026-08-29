import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor'
            }
            if (id.includes('@xyflow') || id.includes('reactflow') || id.includes('dagre')) {
              return 'flow-vendor'
            }
            if (id.includes('leaflet') || id.includes('react-leaflet')) {
              return 'map-vendor'
            }
            if (id.includes('recharts')) {
              return 'chart-vendor'
            }
            if (id.includes('lucide-react') || id.includes('framer-motion')) {
              return 'ui-vendor'
            }
            return 'vendor'
          }
        },
      },
    },
  },
})

