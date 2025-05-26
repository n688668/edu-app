<script setup lang="ts">
useHead({
  title: 'Học Tên Các Loài Cây (Plants)',
})

const isLoading = ref(true)

const prompt = `
Hãy tạo một mảng JSON gồm 20 từ ngẫu nhiên tiếng Anh chủ đề thực vật, mỗi phần tử có dạng:
{
  "name": "từ thực vật ngẫu nhiên bằng tiếng Anh",
  "sound": "/sounds/vietnamese/words/ten-file-theo-text.mp3",
  "emoji": "emoji phù hợp",
}
Chỉ trả về mảng JSON. Các từ nên dễ hiểu với trẻ từ 3-6 tuổi.
`
const { data: plants, fetchWords } = useGeminiWords(prompt)

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

async function playSound(event: MouseEvent, plant: any) {
  const { shootAtCursor } = useConfetti()
  const { playFallback } = useFallbackSound()
  const { tryPlay } = usePlayLocalIfExists()

  // Bắn pháo bông
  shootAtCursor(event)

  if (await tryPlay(plant.sound))
    return

  // Nếu thất bại, fallback
  playFallback()
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-green-100 via-blue-100 to-purple-100 p-6 relative">
    <LoadingScreen v-if="isLoading" />

    <div v-else>
      <h1 class="text-3xl font-bold text-purple-700 mb-8 text-center select-none">
        🌱 Học Tên Các Loài Cây (Plants)
      </h1>

      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 justify-items-center mb-6">
        <div
          v-for="(plant, index) in plants || []"
          :key="`MavGN${index}`"
          class="bg-white p-6 rounded-3xl shadow-lg cursor-pointer flex flex-col items-center justify-center w-32 h-32 active:scale-110 transform transition-all duration-300"
          @click="(e) => playSound(e, plant)"
        >
          <div class="text-7xl mb-2 select-none">
            {{ plant.emoji }}
          </div>
          <div class="text-2xl font-semibold text-purple-900 select-none">
            {{ plant.name }}
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
