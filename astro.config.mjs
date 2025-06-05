import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import node from '@astrojs/node';
import tailwind from '@astrojs/tailwind';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  integrations: [react(), tailwind()],
  output: "server",
  adapter: node({
    mode: 'standalone',
  }),
  vite: {
    plugins: [
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: [
          'favicon.svg',
          'robots.txt',
          'icons/icon-192x192.png',
          'icons/icon-512x512.png'
        ],
        manifest: {
          name: 'Blackline Dashboard',
          short_name: 'Blackline',
          description: 'PWA for Blackline Dashboard',
          start_url: '/',
          display: 'standalone',
          background_color: '#ffffff',
          theme_color: '#1a1719',
          icons: [
            {
              src: '/icons/maskable_icon_x96.png',
              sizes: '96x96',
              type: 'image/png',
            },
            {
              src: '/icons/maskable_icon_x128.png',
              sizes: '128x128',
              type: 'image/png',
            },
            {
              src: '/icons/maskable_icon_x192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: '/icons/maskable_icon_x384.png',
              sizes: '384x384',
              type: 'image/png',
            },
            {
              src: '/icons/maskable_icon_x512.png',
              sizes: '512x512',
              type: 'image/png',
            },
          ],
        },
      }),
    ],
  },
});