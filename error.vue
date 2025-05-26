<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps({
  error: Object as () => NuxtError,
})

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-yellow-100 to-pink-100 text-center p-6">
    <div class="text-[100px] font-extrabold text-red-500 mb-4 animate-bounce">
      {{ error?.statusCode }}
    </div>
    <div class="text-3xl md:text-4xl font-bold text-blue-700 mb-6">
      Ôi không! Trang này không tồn tại!
    </div>
    <div class="text-2xl font-semibold text-gray-700 mb-8">
      Có thể bé đã nhấn nhầm rồi! Hãy quay lại nhé 💛
    </div>
    <button
      class="bg-purple-400 hover:bg-purple-500 text-white text-lg font-bold py-3 px-6 rounded-full shadow-md"
      @click="handleError"
    >
      🔙 Về trang chính
    </button>
  </div>
</template>
