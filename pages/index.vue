<script setup lang="ts">
useHead({
  title: 'Bé Học Vui',
})

const learningItems = [
  { title: 'Tiếng Việt', icon: '🅰️', path: '/learn-vietnamese' },
  { title: 'Tiếng Anh', icon: '🔤', path: '/learn-english' },
  { title: 'Toán', icon: '➗', path: '/learn-math' },
  { title: 'So sánh', icon: '⚖️', path: '/comparison' },
  { title: 'Động vật', icon: '🐶', path: '/animals' },
  { title: 'Kỹ năng', icon: '🧠', path: '/skills' },
  { title: 'Thẻ 1', icon: '🃏', path: '/cards-1' },
  { title: 'Thẻ 2', icon: '🪁', path: '/cards-2' },
  { title: 'Bong bóng', icon: '🫧', path: '/bubble-letter' },
  { title: 'Cá mập', icon: '🦈', path: '/shark' },
  // { title: 'Trái tim 1', icon: '❤️', path: '/heart' },
  { title: 'Trái tim', icon: '💗', path: '/pixi-heart' },
  { title: 'Tô màu', icon: '🎨', path: '/fill-colour' },
  { title: 'Thẻ 1.1', icon: '🃏', path: '/game-cards-1' },
  { title: 'Thẻ 2.1', icon: '🪁', path: '/game-cards-2' },
]

const { launchConfetti } = useConfetti()

function sayHi() {
  launchConfetti()
}

const show = ref(false)

// Tạo cookie với key "child-name"
const cookieName = useCookie<string>('kid-name', {
  default: () => 'Rô',
  maxAge: 60 * 60 * 24 * 365 * 100, // 100 năm
})

const name = ref(cookieName.value)

function onChangeName() {
  cookieName.value = name.value
  show.value = false // ẩn input, quay lại hiển thị lời chào
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-pink-100 to-yellow-100 p-6 pt-16">
    <div class="max-w-2xl mx-auto text-center">
      <h1 v-if="!show" class="text-4xl md:text-5xl font-bold text-pink-600 mb-4 cursor-pointer" @click="show = !show">
        🎈 Chào {{ name }}!
      </h1>
      <div v-else class="mb-4 flex items-center justify-center gap-x-2">
        <input id="name" v-model="name" type="text" class="w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" placeholder="Nhập tên bé" required>
        <button
          type="submit"
          class="w-full rounded-md bg-violet-500 px-4 py-2 text-sm font-semibold text-white duration-150 ease-in-out hover:scale-125"
          @click="onChangeName"
        >
          Đổi tên
        </button>
      </div>

      <p class="text-lg text-gray-700 mb-6">
        Cùng khám phá những điều thú vị nào!
      </p>

      <div class="grid grid-cols-2 sm:grid-cols-3 gap-6">
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
          👉 Pháo bông
        </button>
      </div>
    </div>
  </div>
</template>
