<script setup lang="ts">
import confetti from 'canvas-confetti'
import { Howl } from 'howler'

useHead({
  title: 'Game Chọn Thẻ 2',
})

let tapSound: Howl | null = null

const carItems = useSvgsCar()
const allItems = useSvgsAll()
const baseItems = ref(carItems)

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

const cards: any = ref([])
const selected: any = ref([])
const matchedIds = ref(new Set())
const showCongrats = ref(false)

function resetGame() {
  const selectedItems = shuffle([...baseItems.value]).slice(0, 15)
  const itemPairs = shuffle([...selectedItems, ...selectedItems].map((image, index) => ({
    id: `${index}-${Math.random()}`,
    image,
  })))
  cards.value = itemPairs
  selected.value = []
  matchedIds.value = new Set()
  showCongrats.value = false
}

function selectCard(card) {
  if (
    selected.value.length < 2
    && !matchedIds.value.has(card.id)
    && !selected.value.find(c => c.id === card.id)
  ) {
    selected.value.push(card)
    if (selected.value.length === 2) {
      const [a, b] = selected.value
      if (a.image === b.image) {
        if (!tapSound) {
          tapSound = new Howl({ src: ['/sounds/bubble-pop.mp3'], volume: 1.5 })
        }
        tapSound.play()
        confetti()
        matchedIds.value.add(a.id)
        matchedIds.value.add(b.id)
        selected.value = []

        if (matchedIds.value.size === cards.value.length) {
          showCongrats.value = true
        }
      }
      else {
        setTimeout(() => {
          selected.value = []
        }, 800)
      }
    }
  }
}

function isSelected(card) {
  return selected.value.find(c => c.id === card.id)
}

// 🔹 Hàm đổi bộ hình
function changeSet(type: 'car' | 'all') {
  baseItems.value = type === 'car' ? carItems : allItems
  resetGame()
}

onMounted(() => {
  resetGame()
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100 p-6">
    <h1 class="text-4xl font-bold text-purple-700 mb-8 text-center select-none">
      🪁 Chọn Thẻ Giống Nhau
    </h1>

    <!-- 🔹 Nút chọn bộ hình -->
    <div class="flex justify-center gap-4 mb-6">
      <button class="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600" @click="changeSet('car')">
        🚕 Xe Hơi
      </button>
      <button class="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600" @click="changeSet('all')">
        ⭐ Tất Cả
      </button>
    </div>

    <SuccessMessage v-if="showCongrats" @click="resetGame" />

    <div v-else class="grid grid-cols-3 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
      <button
        v-for="card in cards"
        :key="card.id"
        class="text-5xl h-24 w-full flex items-center justify-center rounded-2xl shadow-md bg-white transition-all duration-300 select-none border-4"
        :disabled="matchedIds.has(card.id)"
        :class="{
          'border-gray-300': !isSelected(card),
          'border-red-500 !bg-red-100': isSelected(card),
          'invisible': matchedIds.has(card.id),
        }"
        @click="selectCard(card)"
      >
        <img :src="card.image" alt="" class="max-w-full max-h-full p-1">
      </button>
    </div>
  </div>
</template>
