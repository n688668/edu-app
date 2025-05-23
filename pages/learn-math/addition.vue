<script setup lang="ts">
import confetti from 'canvas-confetti'
import { Howl } from 'howler'

useHead({
  title: 'Cộng đơn giản',
})

let correctSound: Howl | null = null
let wrongSound: Howl | null = null

const items = ['🍓', '🐻', '🚗', '🍪', '🎈', '🐶', '🐱', '🍉', '🌟', '🦋']

const currentItem = ref({
  icon: '🍓',
  left: 0,
  right: 0,
  total: 0,
})
const options = ref<number[]>([])
const feedback = ref('')
const feedbackColor = ref('')

const selectedOption = ref<number | null>(null)

function randomItem() {
  const icon = items[Math.floor(Math.random() * items.length)] ?? ''
  const left = Math.floor(Math.random() * 11)
  const maxRight = 10 - left
  const right = Math.floor(Math.random() * (maxRight + 1))
  currentItem.value = {
    icon,
    left,
    right,
    total: left + right,
  }
  generateOptions(currentItem.value.total)
}

function generateOptions(correct: number) {
  const set = new Set<number>()
  set.add(correct)
  while (set.size < 3) {
    const randomOffset = Math.floor(Math.random() * 5) - 2
    const newVal = correct + randomOffset
    if (newVal >= 0 && newVal <= 10)
      set.add(newVal)
  }
  options.value = Array.from(set).sort(() => Math.random() - 0.5)
}

onMounted(() => {
  randomItem()
})

function checkAnswer(option: number) {
  selectedOption.value = option
  if (option === currentItem.value.total) {
    if (!correctSound) {
      correctSound = new Howl({ src: ['/sounds/correct.mp3'], volume: 1.0 })
    }
    correctSound.play()
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
    if (!wrongSound) {
      wrongSound = new Howl({ src: ['/sounds/wrong.mp3'], volume: 1.0 })
    }
    wrongSound.play()
    feedback.value = '❌ Sai rồi, thử lại nhé!'
    feedbackColor.value = 'text-red-500'
  }
}

function nextQuestion() {
  randomItem()
  feedback.value = ''
  feedbackColor.value = ''
  selectedOption.value = null
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-green-100 to-yellow-100 p-4">
    <h1 class="text-3xl font-bold text-green-600 text-center mb-6">
      ➕ Cộng đơn giản
    </h1>

    <div class="flex flex-col items-center">
      <div class="text-3xl mb-8 border-b border-gray-500 pb-3">
        Bé hãy cộng các {{ currentItem.icon }} lại nhé:
      </div>

      <div class="flex items-center justify-center gap-4 text-5xl mb-6">
        <div>
          {{ currentItem.left }}
        </div>
        <div>+</div>
        <div>
          {{ currentItem.right }}
        </div>
      </div>

      <div class="flex items-center justify-center gap-4 text-5xl mb-6">
        <div>
          <span v-for="n in currentItem.left" :key="`l${n}`">{{ currentItem.icon }}</span>
        </div>
        <div>+</div>
        <div>
          <span v-for="n in currentItem.right" :key="`r${n}`">{{ currentItem.icon }}</span>
        </div>
      </div>

      <div class="grid grid-cols-3 gap-4 max-w-md w-full my-6">
        <button
          v-for="option in options"
          :key="`kNQUv${option}`"
          class="bg-white px-6 py-3 text-3xl rounded-xl shadow hover:scale-105 transition font-bold text-blue-600 border-4"
          :class="{
            'border-green-500': selectedOption === option && option === currentItem.total,
            'border-red-500': selectedOption === option && option !== currentItem.total,
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
