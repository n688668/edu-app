<script setup lang="ts">
import confetti from 'canvas-confetti'
import { Howl } from 'howler'

useHead({
  title: 'So Sánh',
})

const questions = [
  {
    question: 'Cái nào lớn hơn?',
    options: [
      { emoji: '🍎', label: 'Nhỏ' },
      { emoji: '🍉', label: 'Lớn', correct: true },
    ],
  },
  {
    question: 'Con nào dài hơn?',
    options: [
      { emoji: '🪱', label: 'Ngắn' },
      { emoji: '🐍', label: 'Dài', correct: true },
    ],
  },
  {
    question: 'Cái nào cao hơn?',
    options: [
      { emoji: '🌱', label: 'Thấp' },
      { emoji: '🌴', label: 'Cao', correct: true },
    ],
  },
  {
    question: 'Con nào to hơn?',
    options: [
      { emoji: '🐭', label: 'Nhỏ' },
      { emoji: '🐘', label: 'To', correct: true },
    ],
  },
]

const current = ref(0)
const answered = ref(false)
const wrongIndex = ref(null)

function playSound(correct) {
  const sound = new Howl({
    src: [correct ? '/sounds/correct.mp3' : '/sounds/wrong.mp3'],
  })
  sound.play()
}

function fireConfetti(el) {
  const rect = el.getBoundingClientRect()
  confetti({
    particleCount: 80,
    spread: 90,
    origin: {
      x: (rect.left + rect.width / 2) / window.innerWidth,
      y: (rect.top + rect.height / 2) / window.innerHeight,
    },
  })
}

function selectOption(option, index, event) {
  if (answered.value)
    return
  answered.value = true

  const correct = !!option.correct
  playSound(correct)

  const el = event.currentTarget
  el.classList.add('scale-110')

  if (correct) {
    fireConfetti(el)
  }
  else {
    wrongIndex.value = index
    el.classList.add('animate-shake')
  }

  setTimeout(() => {
    answered.value = false
    wrongIndex.value = null
    el.classList.remove('scale-110', 'animate-shake')
    current.value = (current.value + 1) % questions.length
  }, 2000)
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-pink-100 to-yellow-100 p-6">
    <h1 class="text-3xl font-bold text-purple-700 mb-6 text-center">
      📏 So Sánh
    </h1>

    <div class="text-xl text-center font-semibold mb-4">
      {{ questions[current].question }}
    </div>

    <div class="grid grid-cols-2 gap-6 justify-items-center">
      <div
        v-for="(option, index) in questions[current].options"
        :key="index"
        class="bg-white p-6 rounded-2xl shadow-lg transform transition-all duration-300 cursor-pointer flex flex-col items-center w-36 h-36 justify-center hover:scale-105"
        :class="{
          'animate-shake': wrongIndex === index,
        }"
        @click="(e) => selectOption(option, index, e)"
      >
        <div class="text-6xl mb-2 select-none">
          {{ option.emoji }}
        </div>
        <div class="text-lg font-medium text-purple-800 select-none">
          {{ option.label }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes shake {
  0% { transform: translateX(0); }
  20% { transform: translateX(-8px); }
  40% { transform: translateX(8px); }
  60% { transform: translateX(-8px); }
  80% { transform: translateX(8px); }
  100% { transform: translateX(0); }
}
.animate-shake {
  animation: shake 0.4s ease;
}
</style>
