<script lang="ts" setup>
definePageMeta({
  layout: false, // không dùng layout mặc định
})
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-yellow-100 to-pink-100 text-center p-6">
    <div class="text-[100px] font-extrabold text-red-500 mb-4 animate-bounce">
      404
    </div>
    <div class="text-3xl md:text-4xl font-bold text-blue-700 mb-6">
      Ôi không! Trang này không tồn tại!
    </div>
    <div class="text-2xl font-semibold text-gray-700 mb-8">
      Có thể bé đã nhấn nhầm rồi! Hãy quay lại nhé 💛
    </div>
    <NuxtLink to="/" class="bg-green-500 hover:bg-green-600 text-white text-2xl font-bold py-4 px-8 rounded-2xl shadow-lg transition transform hover:scale-105">
      🔙 Về trang chính
    </NuxtLink>
  </div>
</template>
