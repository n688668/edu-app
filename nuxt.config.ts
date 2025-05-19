// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss'],
  devServer: {
    port: 3001,
  },
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],
})
