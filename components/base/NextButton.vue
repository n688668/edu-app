<script setup lang="ts">
const router = useRouter()
const route = useRoute()

const show = computed(() => route.path !== '/')

function goBack() {
  router.back()
}
</script>

<template>
  <button
    v-if="show"
    class="mr-4 flex items-center gap-2 px-4 py-2 bg-yellow-300 rounded-full font-semibold shadow hover:bg-yellow-400 transition text-lg"
    @click="goBack"
  >
    <!-- SVG icon sinh động -->
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="#f59e0b"
      class="w-6 h-6 animate-bounce-left"
    >
      <path
        d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"
      />
    </svg>
    <span>Quay lại</span>
  </button>
</template>

<style scoped>
@keyframes bounce-left {
  0%, 100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(-4px);
  }
}
.animate-bounce-left {
  animation: bounce-left 0.8s infinite;
}
</style>
