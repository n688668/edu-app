<script setup lang="ts">
useHead({
  title: 'Bé Học Vui',
})

const learningItems = [
  { title: 'Học tiếng Việt', icon: '🅰️', path: '/learn-vietnamese' },
  { title: 'Học tiếng Anh', icon: '🔤', path: '/learn-english' },
  { title: 'Học Toán', icon: '➗', path: '/learn-math' },
  { title: 'Đếm số', icon: '🔢', path: '/counting' },
  { title: 'So sánh', icon: '⚖️', path: '/comparison' },
  { title: 'Động vật', icon: '🐶', path: '/animals' },
  { title: 'Thực vật', icon: '🌱', path: '/plants' },
  { title: 'Kỹ năng', icon: '🧠', path: '/skills' },
  { title: 'Game thẻ 1', icon: '🃏', path: '/game-cards-1' },
  { title: 'Game thẻ 2', icon: '🪁', path: '/game-cards-2' },
  { title: 'Game bong bóng', icon: '🫧', path: '/game-bubble-letter' },
  // { title: 'Trái tim', icon: '💗', path: '/heart' },
  { title: 'Shape', icon: '💗', path: '/shape' },
]

const { launchConfetti } = useConfetti()

function sayHi() {
  // alert('Chào bé! Cùng chơi và học nhé!')
  launchConfetti()
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-pink-100 to-yellow-100 p-6 pt-16">
    <div class="max-w-2xl mx-auto text-center">
      <h1 class="text-4xl md:text-5xl font-bold text-pink-600 mb-4">
        🎈 Chào Rô!
      </h1>
      <p class="text-lg text-gray-700 mb-6">
        Cùng khám phá những điều thú vị nào!
      </p>

      <div class="grid grid-cols-2 gap-6">
        <div
          v-for="item in learningItems"
          :key="`rhTNo${item.title}`"
          class="bg-white rounded-2xl shadow-lg p-4 hover:scale-105 transition-transform duration-300 cursor-pointer"
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
