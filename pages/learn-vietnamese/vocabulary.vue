<script setup lang="ts">
import { Howl } from 'howler'

useHead({
  title: 'Từ vựng Cơ Bản',
})

const isLoading = ref(true)

const prompt = `
Hãy tạo một mảng JSON gồm 20 từ ngẫu nhiên tiếng Việt dành cho trẻ em, mỗi phần tử có dạng:
{
  "text": "từ ngẫu nhiên",
  "icon": "emoji phù hợp",
}
Chỉ trả về mảng JSON. Các từ nên dễ hiểu với trẻ từ 3-6 tuổi.
`
const { data: vocabulary, fetchWords } = useGeminiWords(prompt)

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

function playSound() {
  const sound = new Howl({ src: ['/sounds/sharp-pop.mp3'], volume: 1.0 })
  sound.play()
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-yellow-100 to-pink-100 p-4 relative">
    <LoadingScreen v-if="isLoading" />

    <div v-else>
      <h1 class="text-3xl font-bold text-pink-600 text-center mb-6">
        📚 Từ vựng Cơ Bản
      </h1>

      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
        <div
          v-for="word in vocabulary"
          :key="`EtYAf${word.text}`"
          class="bg-white rounded-2xl shadow-md p-4 flex flex-col items-center active:scale-110 transition cursor-pointer"
          @click="playSound()"
        >
          <div class="text-5xl mb-2">
            {{ word.icon }}
          </div>
          <div class="text-3xl font-semibold text-blue-600">
            {{ word.text }}
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
