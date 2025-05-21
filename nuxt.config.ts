// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss', '@vite-pwa/nuxt'],
  devServer: {
    port: 3001,
  },
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],
  pwa: {
    injectRegister: 'auto',
    registerType: 'autoUpdate', // tự động cập nhật service worker
    manifest: {
      name: 'Kids Kids',
      short_name: 'Kids',
      description: 'Ứng dụng cho bé 3-6 tuổi',
      theme_color: '#fbbf24', // màu theme (tailwind yellow-400)
      background_color: '#fff',
      display: 'standalone',
      scope: '/',
      start_url: '/',
      icons: [
        {
          src: 'pwa-64x64.png',
          sizes: '64x64',
          type: 'image/png',
        },
        {
          src: 'pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: 'maskable-icon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
      ],
    },
    workbox: {
      // cấu hình workbox nếu cần
    },
  },
})
