<script setup lang="ts">
useHead({
  title: 'Đọc Từ Đơn Giản',
})

const isLoading = ref(true)

const prompt = `
Hãy tạo một mảng JSON gồm 12 từ tiếng Việt ngẫu nhiên, và thông dụng trong đời sống cho trẻ em, mỗi phần tử có dạng:
{
  "text": "từ ngẫu nhiên",
  "sound": "/sounds/vietnamese/words/ten-file-theo-text.mp3",
  "emoji": "emoji phù hợp"
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

async function playSound(event: MouseEvent, word: any) {
  const { shootAtCursor } = useConfetti()
  const { playFallback } = useFallbackSound()
  const { tryPlay } = usePlayLocalIfExists()

  // Bắn pháo bông
  shootAtCursor(event)

  if (await tryPlay(word.sound))
    return

  // Nếu thất bại, fallback
  playFallback()
}
</script>

<template>
  <div class="min-h-screen bg-orange-100 p-4 relative">
    <LoadingScreen v-if="isLoading" />

    <div v-else>
      <h1 class="text-3xl font-bold text-center text-orange-600 mb-4">
        📖 Đọc Từ Đơn Giản
      </h1>
      <p class="text-center text-lg mb-4 text-orange-700">
        Bé hãy bấm vào hình hoặc từ để nghe đọc nhé!
      </p>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 px-4 mb-8">
        <div
          v-for="word in simpleWords"
          :key="`CAMjm${word.text}`"
          class="bg-white rounded-2xl shadow-lg p-4 flex flex-col items-center cursor-pointer active:scale-110 transition-transform"
          @click="(e) => playSound(e, word)"
        >
          <div class="text-7xl mb-2">
            {{ word.emoji }}
          </div>
          <span class="text-3xl font-bold text-orange-700">{{ word.text }}</span>
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
