// plugins/disable-copy.client.ts
export default defineNuxtPlugin(() => {
  document.addEventListener('copy', (e) => {
    e.preventDefault()
  })
})
