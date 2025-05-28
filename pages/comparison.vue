<script setup lang="ts">
import confetti from 'canvas-confetti'
import { Howl } from 'howler'

useHead({
  title: 'So Sánh',
})

const current = ref(0)
const answered = ref(false)
const wrongIndex = ref(null)

const isLoading = ref(true)
const questions = ref<any[]>([])

async function fetchData() {
  isLoading.value = true
  try {
    const res = await fetch('/data/vietnamese-comparisons.json')
    const allWords = await res.json()

    // Shuffle và chọn ngẫu nhiên 12 từ
    questions.value = allWords.sort(() => 0.5 - Math.random()).slice(0, 20)

    isLoading.value = false
  }
  catch {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchData()
})

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
    current.value = (current.value + 1) % questions.value.length

    // Kiểm tra nếu hết lượt, tải lại mảng dữ liệu mới
    if (current.value === 0) {
      fetchData()
    }
  }, 2000)
}

// Function to adjust emoji size based on the comparison
function getEmojiSize(option) {
  if (option.type === 1) {
    return 'text-9xl'
  }
  if (option.type === 2) {
    return 'text-5xl'
  }
  return 'text-7xl' // Default size
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-yellow-50 to-pink-100 p-6 relative">
    <LoadingScreen v-if="isLoading" />

    <div v-else>
      <h1 class="text-3xl font-bold text-purple-700 mb-6 text-center">
        📏 So Sánh
      </h1>

      <div class="text-3xl text-center font-semibold mb-8">
        {{ questions[current].question }}
      </div>

      <div class="grid grid-cols-2 gap-6 justify-items-center">
        <div
          v-for="(option, index) in questions[current].options"
          :key="`GNxhZ${index}`"
          class="bg-white p-6 rounded-3xl shadow-xl transform transition-all duration-300 cursor-pointer flex flex-col items-center w-full max-w-xs h-48 justify-center active:scale-110 border-4"
          :class="{
            'border-green-400': answered && option.correct && wrongIndex !== index,
            'border-red-400 animate-shake': answered && wrongIndex === index,
            'border-transparent': !answered || (wrongIndex !== index && !option.correct),
          }"
          @click="(e) => selectOption(option, index, e)"
        >
          <div :class="getEmojiSize(option)" class="mb-3 select-none">
            {{ option.emoji }}
          </div>
          <div class="text-3xl font-medium text-purple-800 select-none">
            {{ option.label }}
          </div>
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
