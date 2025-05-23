<script setup lang="ts">
useHead({
  title: 'Học Tiếng Việt',
})

const items = [
  { title: 'Bảng chữ cái', icon: '🔡', path: '/learn-vietnamese/alphabet' },
  {
    title: 'Ghép vần đơn giản',
    icon: '🧩',
    path: '/learn-vietnamese/syllables',
  },
  {
    title: 'Đọc từ đơn giản',
    icon: '📖',
    path: '/learn-vietnamese/simple-words',
  },
  { title: 'Tập viết chữ', icon: '✍️', path: '/learn-vietnamese/writing' },
  {
    title: 'Phân biệt âm vần',
    icon: '🔈',
    path: '/learn-vietnamese/pronunciation',
  },
  {
    title: 'Từ vựng Cơ Bản',
    icon: '📚',
    path: '/learn-vietnamese/vocabulary',
  },
  { title: 'Game bong bóng', icon: '🫧', path: '/learn-vietnamese/game-bubble' },
]
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-yellow-100 to-pink-100 p-4">
    <h1 class="text-3xl font-bold text-pink-600 text-center mb-6">
      🌟 Học Tiếng Việt 🌟
    </h1>

    <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
      <div
        v-for="item in items"
        :key="`WKyCD${item.title}`"
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
