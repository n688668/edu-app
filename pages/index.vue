<script setup lang="ts">
const learningItems = [
  { title: 'Học tiếng Việt', icon: '🅰️', path: '/learn-vietnamese' },
  { title: 'Học tiếng Anh', icon: '🔤', path: '/learn-english' },
  { title: 'Học Toán', icon: '➗', path: '/learn-math' },
  { title: 'Đếm số', icon: '🔢', path: '/counting' },
  { title: 'So sánh', icon: '⚖️', path: '/comparison' },
  { title: 'Màu sắc', icon: '🎨', path: '/colors' },
  { title: 'Động vật', icon: '🐶', path: '/animals' },
  { title: 'Thực vật', icon: '🌱', path: '/plants' },
  { title: 'Học lễ', icon: '🎎', path: '/manners' },
  { title: 'Kỹ năng sống', icon: '🧠', path: '/life-skills' },
]

function sayHi() {
  alert('Chào bé! Cùng chơi và học nhé!')
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-pink-100 to-yellow-100 p-6">
    <div class="max-w-2xl mx-auto text-center">
      <h1 class="text-4xl md:text-5xl font-bold text-pink-600 mb-4">
        🎈 Chào bé!
      </h1>
      <p class="text-lg text-gray-700 mb-6">
        Cùng khám phá những điều thú vị nào!
      </p>

      <div class="grid grid-cols-2 gap-6">
        <div
          v-for="item in learningItems"
          :key="item.title"
          class="bg-white rounded-2xl shadow-lg p-4 hover:scale-105 transition-transform duration-300"
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

      <div class="mt-8">
        <button
          class="bg-green-400 hover:bg-green-500 text-white text-lg font-bold py-3 px-6 rounded-full shadow-md"
          @click="sayHi"
        >
          👉 Bấm vào đây để bắt đầu
        </button>
      </div>
    </div>
  </div>
</template>
