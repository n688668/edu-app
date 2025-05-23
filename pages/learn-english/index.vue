<script setup lang="ts">
useHead({
  title: 'Học Tiếng Anh',
})

const items = [
  {
    title: 'Bảng chữ cái tiếng Anh',
    path: '/learn-english/alphabet',
    icon: '🔤',
  },
  {
    title: 'Từ vựng cơ bản',
    path: '/learn-english/vocabulary',
    icon: '🧠',
  },
  {
    title: 'Màu sắc tiếng Anh',
    path: '/learn-english/colors',
    icon: '🎨',
  },
  {
    title: 'Số đếm',
    path: '/learn-english/numbers',
    icon: '🔢',
  },
  {
    title: 'Phân biệt từ',
    path: '/learn-english/word-match',
    icon: '🧩',
  },
  { title: 'Game bong bóng', icon: '🫧', path: '/learn-english/game-bubble' },
]
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-yellow-100 to-pink-100 p-4">
    <h1 class="text-3xl font-bold text-pink-600 text-center mb-6">
      🌟 Học Tiếng Anh 🌟
    </h1>

    <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
      <div
        v-for="item in items"
        :key="`WKyEF${item.title}`"
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
