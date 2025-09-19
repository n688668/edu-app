<script setup lang="ts">
import confetti from 'canvas-confetti'
import { Howl } from 'howler'

useHead({
  title: 'So sánh số lượng',
})

let correctSound: Howl | null = null
let wrongSound: Howl | null = null

const icons = ['🍎', '🐶', '🌸', '🎈', '🚗', '🍩', '🍓', '🦋', '🐱', '🍪']

const current = ref({
  icon: '🍎',
  left: 0,
  right: 0,
  correct: '=',
})
const feedback = ref('')
const feedbackColor = ref('')
const selected = ref<string | null>(null)

function generateNew() {
  const icon = icons[Math.floor(Math.random() * icons.length)] ?? ''
  const left = Math.floor(Math.random() * 21) + 1 // 1-21
  const right = Math.floor(Math.random() * 21) + 1
  const correct = left < right ? '<' : left > right ? '>' : '='
  current.value = { icon, left, right, correct }
}

onMounted(() => {
  generateNew()
})

function checkAnswer(op: string) {
  selected.value = op
  if (op === current.value.correct) {
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
    feedback.value = '🎉 Đúng rồi!'
    feedbackColor.value = 'text-green-600'
    setTimeout(() => {
      feedback.value = ''
      feedbackColor.value = ''
      selected.value = null
      generateNew()
    }, 1500)
  }
  else {
    if (!wrongSound) {
      wrongSound = new Howl({ src: ['/sounds/wrong.mp3'], volume: 1.0 })
    }
    wrongSound.play()
    feedback.value = '😅 Sai rồi, thử lại nhé!'
    feedbackColor.value = 'text-red-500'
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 p-4 pt-16">
    <h1 class="text-3xl font-bold text-green-600 text-center mb-6">
      🔢 So sánh số lượng
    </h1>

    <div class="flex flex-col items-center gap-4">
      <div class="text-xl text-center text-blue-700 font-semibold mb-2">
        Bé hãy chọn dấu đúng nhé!
      </div>

      <div class="flex items-center justify-center gap-4 text-5xl mb-6">
        <div>
          {{ current.left }}
        </div>
        <div>{{ selected ?? '?' }}</div>
        <div>
          {{ current.right }}
        </div>
      </div>

      <!-- Hai nhóm biểu tượng -->
      <div class="flex justify-center items-center gap-6 text-5xl mb-4">
        <div>
          <span v-for="n in current.left" :key="`l${n}`">{{ current.icon }}</span>
        </div>
        <div class="text-4xl">
          {{ selected ?? '?' }}
        </div>
        <div>
          <span v-for="n in current.right" :key="`r${n}`">{{ current.icon }}</span>
        </div>
      </div>

      <!-- Các lựa chọn dấu -->
      <div class="flex gap-6">
        <button
          v-for="op in ['<', '=', '>']"
          :key="`mSSNw${op}`"
          class="bg-white px-6 py-3 text-3xl rounded-xl shadow hover:scale-110 transition font-bold text-purple-600 border-4"
          :class="{
            'border-green-500': selected === op && op === current.correct,
            'border-red-500': selected === op && op !== current.correct,
            'border-transparent': selected !== op,
          }"
          :disabled="feedback === '🎉 Đúng rồi!'"
          @click="checkAnswer(op)"
        >
          {{ op }}
        </button>
      </div>

      <!-- Phản hồi -->
      <div v-if="feedback" class="mt-6 text-3xl font-bold" :class="feedbackColor">
        {{ feedback }}
      </div>
    </div>
  </div>
</template>
