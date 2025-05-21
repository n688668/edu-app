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
    <!-- Mũi tên trái sinh động -->
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="#f59e0b"
      viewBox="0 0 24 24"
      class="w-6 h-6 animate-bounce-left"
    >
      <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
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
