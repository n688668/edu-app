<script setup lang="ts">
useHead({
  title: 'Học Toán',
})

const items = [
  { title: 'Đếm số', icon: '🔢', path: '/learn-math/counting' },
  { title: 'Cộng đơn giản', icon: '➕', path: '/learn-math/addition' },
  { title: 'Trừ đơn giản', icon: '➖', path: '/learn-math/subtraction' },
  { title: 'So sánh số lượng', icon: '⚖️', path: '/learn-math/comparison' },
  { title: 'Hình dạng cơ bản', icon: '🔺', path: '/learn-math/shapes' },
  { title: 'Game bong bóng', icon: '🫧', path: '/learn-math/game-bubble' },
  { title: 'Tạo bài tập toán (Word)', icon: '📝', path: '/learn-math/exam' },
]
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-yellow-100 to-pink-100 p-4 pt-16">
    <h1 class="text-3xl font-bold text-pink-600 text-center mb-6">
      🌟 Học Toán 🌟
    </h1>

    <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
      <div
        v-for="item in items"
        :key="`WKAop${item.title}`"
        class="bg-white rounded-2xl shadow-md p-4 text-center hover:scale-105 transition-transform duration-300 cursor-pointer"
        @click="navigateTo({ path: item.path })"
      >
        <div class="text-5xl mb-2">
          {{ item.icon }}
        </div>
        <h2 class="text-2xl font-semibold text-pink-500">
          {{ item.title }}
        </h2>
      </div>
    </div>
  </div>
</template>
