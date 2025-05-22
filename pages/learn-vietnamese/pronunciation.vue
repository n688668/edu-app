<script setup lang="ts">
import confetti from 'canvas-confetti'
import { Howl } from 'howler'

useHead({
  title: 'Học Tiếng Việt',
})

function shuffleOptions<T>(array: T[]): T[] {
  return array
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)
}

const isLoading = ref(true)

const prompt = `
Hãy tạo một mảng JSON gồm 20 từ ngẫu nhiên tiếng Việt dành cho trẻ em, mỗi phần tử có dạng:
{
  "word": "từ ngẫu nhiên",
  "correct": "vần đúng cần chọn",
  "options": ["vần sai", "vần đúng"],
  "audio": "/audio/tên_file.mp3"
}
Chỉ trả về mảng JSON. Các vần nên phổ biến và dễ hiểu với trẻ từ 3-6 tuổi. Đảm bảo mỗi phần tử có một vần đúng duy nhất và một vần gây nhiễu hợp lý.
`
const { data: simpleWords, fetchWords } = useGeminiWords(prompt)

async function fetchData() {
  isLoading.value = true
  try {
    // Bước 1: Loại bỏ các dòng bắt đầu bằng ```
    await fetchWords()

    isLoading.value = false
  }
  catch {
    // Nếu lỗi, giữ nguyên defaultWords
    isLoading.value = false
  }
}

onMounted(() => {
  fetchData()
})

const currentIndex = ref(0)
const selectedOption = ref<string | null>(null)
const isCorrect = ref<boolean | null>(null)

const currentWord = computed(() => {
  const word = simpleWords.value[currentIndex.value]
  return {
    ...word,
    options: shuffleOptions([...word.options]),
  }
})

let sound: Howl | null = null

function checkAnswer(option: string) {
  if (selectedOption.value)
    return
  selectedOption.value = option
  isCorrect.value = option === currentWord.value.correct

  if (isCorrect.value) {
    playAudio(currentWord.value.audio)
    confetti({
      particleCount: 150,
      angle: 90,
      spread: 90,
      origin: { x: 0.5, y: 0.4 },
      colors: ['#ff0', '#f0f', '#0ff', '#0f0', '#f00'],
    })
  }
}

function nextWord() {
  selectedOption.value = null
  isCorrect.value = null
  currentIndex.value = (currentIndex.value + 1) % simpleWords.value.length

  // Kiểm tra nếu hết lượt, tải lại mảng dữ liệu mới
  if (currentIndex.value === 0) {
    fetchData()
  }
}

function playAudio(src: string) {
  if (sound) {
    sound.stop()
    sound.unload()
  }
  sound = new Howl({
    src: [src],
    volume: 1.0,
  })
  sound.play()
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-yellow-100 to-pink-100 p-6 flex flex-col items-center relative">
    <LoadingScreen v-if="isLoading" />

    <div v-else class="p-8 w-full max-w-md text-center">
      <h1 class="text-3xl font-bold text-pink-600 text-center mb-6">
        🔈Phân biệt âm vần
      </h1>

      <p class="text-8xl font-bold mb-10 text-yellow-600 drop-shadow-sm">
        {{ currentWord.word }}
      </p>

      <div class="flex justify-around mb-10 gap-6">
        <button
          v-for="(option, index) in currentWord.options"
          :key="`OwLsG${index}`"
          class="w-32 h-32 rounded-full text-5xl font-bold shadow-lg transition transform active:scale-110 flex items-center justify-center"
          :class="{
            'bg-gradient-to-br from-green-400 to-green-600 text-white': selectedOption === option && isCorrect === true,
            'bg-gradient-to-br from-red-400 to-red-600 text-white': selectedOption === option && isCorrect === false,
            'bg-gradient-to-br from-purple-400 to-purple-600 text-white': selectedOption !== option,
            'shake': selectedOption === option && isCorrect === false,
          }"
          @click="checkAnswer(option)"
        >
          {{ option }}
        </button>
      </div>

      <div v-if="selectedOption" class="mb-6">
        <p
          class="text-3xl font-bold"
          :class="isCorrect ? 'text-green-600' : 'text-red-600'"
        >
          {{ isCorrect ? '🎉 Giỏi lắm!' : '😢 Sai rồi, thử lại nhé!' }}
        </p>
      </div>

      <button
        v-if="selectedOption"
        class="mt-2 px-10 py-5 bg-pink-400 hover:bg-pink-500 text-white rounded-full font-bold text-2xl shadow-lg transition"
        @click="nextWord"
      >
        👉 Tiếp tục
      </button>
    </div>
  </div>
</template>

<style scoped>
button:focus {
  outline: none;
  box-shadow: 0 0 0 3px #fcd34d;
}
</style>
