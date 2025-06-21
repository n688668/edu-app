<script setup lang="ts">
import { Howl } from 'howler'

useHead({
  title: 'Phân Biệt Từ (Word Match)',
})

let correctSound: Howl | null = null
let wrongSound: Howl | null = null

const isLoading = ref(true)
const wordPairs = ref<any[]>([])

async function fetchData() {
  isLoading.value = true
  try {
    const res = await fetch('/data/english-words-match.json')
    const allWords = await res.json()

    // Shuffle và chọn ngẫu nhiên 12 từ
    wordPairs.value = allWords.sort(() => 0.5 - Math.random()).slice(0, 12)

    isLoading.value = false
  }
  catch {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchData()
})

const selectedOption = ref<{ [key: number]: string }>({})

function selectOption(index: number, option: string) {
  selectedOption.value[index] = option
  checkAnswer(index, option)
}

function checkAnswer(index: number, selected: string) {
  const isCorrect = selected === wordPairs.value[index].answer
  wordPairs.value[index].result = isCorrect ? 'correct' : 'wrong'

  // Phát âm thanh
  if (isCorrect) {
    if (!correctSound) {
      correctSound = new Howl({ src: ['/sounds/correct.mp3'], volume: 1.0 })
    }
    correctSound.play()
  }
  else {
    if (!wrongSound) {
      wrongSound = new Howl({ src: ['/sounds/wrong.mp3'], volume: 1.0 })
    }
    wrongSound.play()
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-pink-100 to-yellow-100 p-4 pt-16 relative">
    <LoadingScreen v-if="isLoading" />

    <div v-else>
      <h1 class="text-3xl font-bold text-pink-700 text-center mb-6">
        🔤 Phân Biệt Từ (Word Match)
      </h1>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div
          v-for="(pair, index) in wordPairs"
          :key="`blMth${index}`"
          class="bg-white p-4 rounded-2xl shadow-md flex flex-col items-center"
        >
          <div class="text-7xl mb-2">
            {{ pair.icon }}
          </div>
          <div class="mt-4 flex flex-wrap gap-3 justify-center">
            <button
              v-for="option in pair.options"
              :key="`tUuaK${option}`"
              class="px-3 py-2 bg-blue-100 text-blue-800 font-semibold rounded-xl shadow hover:bg-blue-200 active:scale-110 transition text-3xl" :class="[
                selectedOption[index] === option
                  ? wordPairs[index].result === 'correct'
                    ? 'border-4 border-green-500'
                    : wordPairs[index].result === 'wrong'
                      ? 'border-4 border-red-500'
                      : 'border-4 border-yellow-500'
                  : '',
              ]"
              @click="selectOption(index, option)"
            >
              {{ option }}
            </button>
          </div>
          <div
            v-if="pair.result" class="mt-3 text-3xl font-bold" :class="{
              'text-green-600': pair.result === 'correct',
              'text-red-500': pair.result === 'wrong',
            }"
          >
            {{ pair.result === 'correct' ? '✅ Đúng rồi!' : '❌ Sai rồi!' }}
          </div>
        </div>
      </div>

      <div class="flex justify-center mb-6">
        <button
          class="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-4 px-8 text-2xl rounded-full shadow-lg active:scale-105 transition-transform"
          @click="fetchData"
        >
          🔁 Tải các từ khác
        </button>
      </div>
    </div>
  </div>
</template>
