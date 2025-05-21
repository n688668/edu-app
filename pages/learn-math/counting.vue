<script setup lang="ts">
import confetti from 'canvas-confetti'

useHead({
  title: 'Đếm số',
})

const items = ref<{ icon: string, count: number }[]>([])

const icons = ['🍎', '🐶', '🚗', '🎈', '🍪', '🐱', '🍉', '🌟', '🦋', '🍓']

// Tạo mảng câu hỏi ngẫu nhiên với số từ 1 đến 100
function generateRandomItems() {
  const arr: any = []
  for (let i = 0; i < 10; i++) {
    arr.push({
      icon: icons[Math.floor(Math.random() * icons.length)],
      count: Math.floor(Math.random() * 20) + 1,
    })
  }
  return arr
}

items.value = generateRandomItems()

const currentIndex = ref(0)
const currentItem = computed(() => items.value[currentIndex.value])

const options = ref<number[]>([])
const feedback = ref('')
const feedbackColor = ref('')

const selectedOption = ref<number | null>(null)

// Tạo 3 phương án trả lời (1 đúng, 2 sai)
function generateOptions(correct: number) {
  const set = new Set<number>()
  set.add(correct)
  while (set.size < 3) {
    // Tạo số sai trong phạm vi ±3, khác số đúng
    let wrong = correct + Math.floor(Math.random() * 7) - 3
    if (wrong < 1)
      wrong = 1
    if (wrong > 100)
      wrong = 100
    if (wrong !== correct)
      set.add(wrong)
  }
  return Array.from(set).sort(() => Math.random() - 0.5)
}

function nextQuestion() {
  currentIndex.value = (currentIndex.value + 1) % items.value.length
  options.value = generateOptions(currentItem.value.count)
  feedback.value = ''
  feedbackColor.value = ''
  selectedOption.value = null
}

function checkAnswer(option: number) {
  selectedOption.value = option
  if (option === currentItem.value.count) {
    confetti({
      particleCount: 150,
      angle: 90,
      spread: 90,
      origin: { x: 0.5, y: 0.4 },
      colors: ['#ff0', '#f0f', '#0ff', '#0f0', '#f00'],
    })
    feedback.value = '🎉 Chính xác!'
    feedbackColor.value = 'text-green-600'
    setTimeout(() => {
      feedback.value = ''
      feedbackColor.value = ''
      selectedOption.value = null
      nextQuestion()
    }, 1500)
  }
  else {
    feedback.value = '❌ Sai rồi, thử lại nhé!'
    feedbackColor.value = 'text-red-500'
  }
}

options.value = generateOptions(currentItem.value.count)
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-yellow-100 to-pink-100 p-4">
    <h1 class="text-3xl font-bold text-pink-600 text-center mb-4">
      🔢 Đếm số
    </h1>

    <div class="flex flex-col items-center">
      <div class="text-3xl mb-8 border-b border-gray-500 pb-3">
        Hãy đếm xem có bao nhiêu {{ currentItem.icon }}
      </div>

      <div class="flex flex-wrap justify-center gap-3 mb-6 max-w-xl">
        <span
          v-for="n in currentItem.count"
          :key="`OLETr${n}`"
          class="text-5xl"
        >
          {{ currentItem.icon }}
        </span>
      </div>

      <div class="grid grid-cols-3 gap-4 max-w-md w-full">
        <button
          v-for="option in options"
          :key="`BdXAy${option}`"
          class="bg-white px-6 py-3 text-5xl rounded-xl shadow hover:scale-105 transition font-bold text-blue-600 border-4"
          :class="{
            'border-green-500': selectedOption === option && option === currentItem.count,
            'border-red-500': selectedOption === option && option !== currentItem.count,
            'border-transparent': selectedOption !== option,
          }"

          :disabled="feedback === '🎉 Chính xác!'"
          @click="checkAnswer(option)"
        >
          {{ option }}
        </button>
      </div>

      <div v-if="feedback" class="mt-6 text-3xl font-bold" :class="feedbackColor">
        {{ feedback }}
      </div>
    </div>
  </div>
</template>
