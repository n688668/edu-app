<script setup lang="ts">
useHead({
  meta: [
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no',
    },
  ],
})

const deferredPrompt = ref<Event | null>(null)
const showInstallPrompt = ref(false)

function isAppInstalled(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches
    || (window.navigator as any).standalone === true
  )
}

onMounted(() => {
  if (isAppInstalled())
    return

  window.addEventListener('beforeinstallprompt', (e: Event) => {
    e.preventDefault()
    deferredPrompt.value = e
    showInstallPrompt.value = true
  })
})

async function installPWA() {
  if (deferredPrompt.value) {
    const promptEvent = deferredPrompt.value as any
    promptEvent.prompt()
    const { outcome } = await promptEvent.userChoice
    if (outcome === 'accepted') {
      console.warn('Người dùng đã cài đặt PWA')
    }
    else {
      console.warn('Người dùng từ chối cài đặt')
    }
    showInstallPrompt.value = false
    deferredPrompt.value = null
  }
}
</script>

<template>
  <div>
    <NuxtPwaManifest />
    <NuxtLoadingIndicator />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <!-- Floating Install Prompt -->
    <transition name="slide-up">
      <div
        v-if="showInstallPrompt"
        class="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-[95%] max-w-md bg-white border border-gray-200 shadow-2xl rounded-2xl px-5 py-4 z-50 backdrop-blur-md flex items-start gap-4"
      >
        <div class="text-3xl pt-1">
          📲
        </div>
        <div class="flex-1">
          <p class="text-base text-gray-800 font-semibold leading-snug">
            Cài đặt ứng dụng để có trải nghiệm tốt hơn!
          </p>
          <div class="mt-4 flex justify-end gap-3">
            <button
              class="px-5 py-2 rounded-xl bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200"
              @click="showInstallPrompt = false"
            >
              Để sau
            </button>
            <button
              class="px-5 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 shadow"
              @click="installPWA"
            >
              Cài đặt
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
