<script setup lang="ts">
useHead({
  title: 'Các Loài Động Vật (Animals)',
})

const isLoading = ref(true)
const simpleWords = ref<any[]>([])

async function fetchData() {
  isLoading.value = true
  try {
    const res = await fetch('/data/english-words-animals.json')
    const allWords = await res.json()

    // Shuffle và chọn ngẫu nhiên 12 từ
    const shuffled = allWords.sort(() => 0.5 - Math.random()).slice(0, 20)

    // Gán sound dựa trên name
    simpleWords.value = shuffled.map((word: any) => ({
      ...word,
      sound: `/sounds/english/words/${word.name}.mp3`,
    }))

    isLoading.value = false
  }
  catch {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchData()
})

async function playSound(event: MouseEvent, word: any) {
  const { shootAtCursor } = useConfetti()
  const { playFallback } = useFallbackSound()
  const { tryPlay } = usePlayAudio()

  shootAtCursor(event)

  if (await tryPlay(word.sound))
    return

  playFallback()
}
</script>

<template>
  <div class="min-h-screen bg-orange-100 p-4 relative">
    <LoadingScreen v-if="isLoading" />

    <div v-else>
      <h1 class="text-3xl font-bold text-center text-orange-600 mb-4">
        🐾 Các Loài Động Vật (Animals)
      </h1>
      <p class="text-center text-lg mb-4 text-orange-700">
        Bé hãy bấm vào hình hoặc từ để nghe đọc nhé!
      </p>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 px-4 mb-8">
        <div
          v-for="word in simpleWords"
          :key="`CAMjn${word.text}`"
          class="bg-white rounded-2xl shadow-lg p-4 flex flex-col items-center cursor-pointer active:scale-110 transition-transform"
          @click="(e) => playSound(e, word)"
        >
          <div class="text-7xl mb-2">
            {{ word.emoji }}
          </div>
          <span class="text-3xl font-bold text-orange-700 text-center">{{ word.text }}</span>
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
