import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['mascota/pet_happy.png'],
      manifest: {
        name: 'Mi Lente en Cusco',
        short_name: 'Mi Lente',
        description: 'Álbum de viaje íntimo — Cusco 2026',
        theme_color: '#F3AFC7',
        background_color: '#FFF3E4',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Solo cachea el shell de la app (HTML/JS/CSS) — las fotos siempre vienen de Supabase.
        globPatterns: ['**/*.{js,css,html,svg,woff2}'],
      },
    }),
  ],
  server: {
    port: 5173,
    open: true,
  },
})
