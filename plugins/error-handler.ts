export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.config.errorHandler = () => {
    // handle error, e.g. report to a service
  }

  // Also possible
  nuxtApp.hook('vue:error', () => {
    // handle error, e.g. report to a service
  })
})
