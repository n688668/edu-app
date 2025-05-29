<script setup lang="ts">
import confetti from 'canvas-confetti'
import { Howl } from 'howler'

useHead({
  title: 'Phân biệt âm vần',
})

let correctSound: Howl | null = null
let wrongSound: Howl | null = null

function shuffleOptions<T>(array: T[]): T[] {
  return array
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)
}

const isLoading = ref(true)
const simpleWords = ref<any[]>([])

async function fetchData() {
  isLoading.value = true
  try {
    const response = await fetch('/data/vietnamese-rhymes.json')
    const rhymeData: Array<{ rhyme: string, words: string[] }> = await response.json()

    // Gom tất cả từ kèm rhyme tương ứng
    const wordList: Array<{ text: string, rhyme: string }> = []
    for (const item of rhymeData) {
      for (const word of item.words) {
        wordList.push({ text: word, rhyme: item.rhyme })
      }
    }

    // Xáo trộn và lấy 20 từ ngẫu nhiên
    const selected = wordList
      .sort(() => Math.random() - 0.5)
      .slice(0, 20)

    // Tạo mảng phù hợp cho simpleWords
    const finalWords = selected.map((wordObj) => {
      // Tìm rhyme khác bất kỳ (gây nhiễu)
      const otherRhymes = rhymeData
        .map(r => r.rhyme)
        .filter(r => r !== wordObj.rhyme)
      const randomWrong = otherRhymes[Math.floor(Math.random() * otherRhymes.length)]

      return {
        text: wordObj.text,
        correct: wordObj.rhyme,
        options: shuffleOptions([wordObj.rhyme, randomWrong]),
      }
    })

    simpleWords.value = finalWords
    isLoading.value = false
  }
  catch (error) {
    console.error('Lỗi tải dữ liệu:', error)
    isLoading.value = false
  }
}

onMounted(() => {
  fetchData()
})

const currentIndex = ref(0)
const selectedOption = ref<string | null>(null)
const isCorrect = ref<boolean | null>(null)
const checked = ref(false)

const currentWord = computed(() => {
  const word = simpleWords.value[currentIndex.value]
  return {
    ...word,
    options: shuffleOptions([...word.options]),
  }
})

async function playSound(text: string, path: any = null) {
  const { tryPlay } = usePlayAudio()

  const filename = letterToFilename(text)

  await tryPlay(`/sounds/vietnamese/${path || 'rhymes'}/${filename}.mp3`)
}

function handleSelectOption(option: string) {
  if (checked.value)
    return
  selectedOption.value = option
  playSound(option, 'syllables')
}

function checkAnswer() {
  if (!selectedOption.value || checked.value)
    return
  isCorrect.value = selectedOption.value === currentWord.value.correct
  checked.value = true

  if (isCorrect.value) {
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
  }
  else {
    if (!wrongSound) {
      wrongSound = new Howl({ src: ['/sounds/wrong.mp3'], volume: 1.0 })
    }
    wrongSound.play()
  }
}

function nextWord() {
  selectedOption.value = null
  isCorrect.value = null
  checked.value = false
  currentIndex.value = (currentIndex.value + 1) % simpleWords.value.length
  if (currentIndex.value === 0) {
    fetchData()
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-yellow-100 to-pink-100 p-6 flex flex-col items-center relative">
    <LoadingScreen v-if="isLoading" />

    <div v-else class="p-8 w-full max-w-md text-center">
      <h1 class="text-3xl font-bold text-pink-600 text-center mb-6">
        🔈Phân biệt âm vần
      </h1>

      <div class="flex justify-center items-center gap-4 mb-10" @click="playSound(currentWord.text)">
        <p class="text-8xl font-bold text-yellow-600 drop-shadow-sm">
          {{ currentWord.text }}
        </p>
        <button class="text-5xl">
          🔊
        </button>
      </div>

      <div class="flex justify-around mb-6 gap-6 flex-wrap">
        <button
          v-for="(option, index) in currentWord.options"
          :key="`OwLsG${index}`"
          class="w-32 h-32 rounded-full text-5xl font-bold shadow-lg transition transform active:scale-110 flex items-center justify-center"
          :class="{
            'bg-gradient-to-br from-green-400 to-green-600 text-white': checked && selectedOption === option && isCorrect,
            'bg-gradient-to-br from-red-400 to-red-600 text-white': checked && selectedOption === option && !isCorrect,
            'bg-gradient-to-br from-purple-400 to-purple-600 text-white': !checked || selectedOption !== option,
            'shake': checked && selectedOption === option && !isCorrect,
          }"
          @click="handleSelectOption(option)"
        >
          {{ option }}
        </button>
      </div>

      <div v-if="selectedOption && !checked" class="mb-6">
        <button
          class="mt-2 px-10 py-5 bg-green-400 hover:bg-green-500 text-white rounded-full font-bold text-3xl shadow-lg transition"
          @click="checkAnswer"
        >
          ✅ Kiểm tra
        </button>
      </div>

      <div v-if="checked" class="mb-6">
        <p
          class="text-3xl font-bold"
          :class="isCorrect ? 'text-green-600' : 'text-red-600'"
        >
          {{ isCorrect ? '🎉 Giỏi lắm!' : '😢 Sai rồi, thử lại nhé!' }}
        </p>
        <button
          class="mt-2 px-10 py-5 bg-pink-400 hover:bg-pink-500 text-white rounded-full font-bold text-3xl shadow-lg transition"
          @click="nextWord"
        >
          👉 Tiếp tục
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
button:focus {
  outline: none;
  box-shadow: 0 0 0 3px #fcd34d;
}
.shake {
  animation: shake 0.4s;
}
@keyframes shake {
  0% { transform: translateX(0); }
  25% { transform: translateX(-8px); }
  50% { transform: translateX(8px); }
  75% { transform: translateX(-4px); }
  100% { transform: translateX(0); }
}
</style>
