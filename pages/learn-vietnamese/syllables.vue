<script setup lang="ts">
interface Rhyme {
  text: string
  result: string
}

interface VowelData {
  vowel: string
  rhyme: Rhyme[]
}

const syllables = ref<VowelData[]>([])
const selectedVowel = ref<VowelData | null>(null)
const selectedRhyme = ref<Rhyme | null>(null)

useHead({ title: 'Trò chơi Ghép Vần' })

onMounted(async () => {
  const data = await fetch('/data/vietnamese-syllables.json').then(res => res.json())
  syllables.value = data
})

async function playSound(result: string) {
  const { playFallback } = useFallbackSound()
  const { tryPlay } = usePlayAudio()

  if (await tryPlay(`/sounds/vietnamese/words/${slugify(result)}.mp3`))
    return

  playFallback()
}

async function handleVowelClick(item: VowelData) {
  selectedVowel.value = item
  selectedRhyme.value = null
  await playSound(item.vowel)
}

async function handleRhymeClick(r: Rhyme) {
  // Cập nhật rhyme được chọn
  selectedRhyme.value = r

  // Phát âm text trước (ví dụ: "nh")
  await playSound(r.text)

  // Sau đó phát âm result (ví dụ: "nha")
  await playSound(r.result)
}
</script>

<template>
  <div class="min-h-screen bg-pink-100 p-4">
    <h1 class="text-3xl font-bold text-center text-pink-600 mb-6">
      🧩 Trò chơi Ghép Vần
    </h1>

    <!-- Danh sách nguyên âm -->
    <div class="flex flex-wrap justify-center gap-4 mb-6">
      <button
        v-for="item in syllables"
        :key="`SolpO${item.vowel}`"
        class="w-24 h-24 rounded-full text-4xl font-bold shadow-lg transition-all duration-200 flex items-center justify-center bg-white hover:bg-yellow-100 text-pink-600 border-4 border-pink-300"
        @click="() => handleVowelClick(item)"
      >
        {{ item.vowel }}
      </button>
    </div>

    <!-- Danh sách rhyme -->
    <div v-if="selectedVowel" class="text-center mb-6">
      <h2 class="text-3xl text-blue-700 font-semibold mb-4">
        Chọn chữ để ghép với: <span class="text-red-500">{{ selectedVowel.vowel }}</span>
      </h2>
      <div class="flex flex-wrap justify-center gap-4">
        <button
          v-for="r in selectedVowel.rhyme"
          :key="`CWgAb${r.text}`"
          class="w-24 h-24 rounded-full text-4xl font-bold shadow-md transition-all duration-200 flex items-center justify-center bg-white hover:bg-green-100 text-blue-600 border-4 border-blue-300"
          @click="() => handleRhymeClick(r)"
        >
          {{ r.text }}
        </button>
      </div>
    </div>

    <!-- Kết quả cố định dưới màn hình -->
    <div
      v-if="selectedRhyme"
      class="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-[90%] max-w-md bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-2xl z-50"
    >
      <div class="text-3xl text-green-700 font-bold mb-6 text-center">
        🎉 Bé đã ghép được:
      </div>
      <div class="text-7xl text-red-600 font-extrabold text-center mb-6">
        {{ selectedRhyme.result }}
      </div>

      <div class="flex justify-center">
        <button
          class="bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-full px-6 py-2 text-2xl font-semibold shadow"
          @click="selectedRhyme = null"
        >
          🔄 Chọn lại
        </button>
      </div>
    </div>
  </div>
</template>
