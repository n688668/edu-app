<script setup lang="ts">
useHead({
  title: 'Bảng Chữ Cái Tiếng Anh',
})

const alphabet = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
]

// Hàm chuyển ký tự tiếng Việt có dấu sang tên file không dấu
function letterToFilename(letter: string): string {
  return letter.toLowerCase()
}

// Phát âm chữ cái
async function playSound(event: MouseEvent, letter: string) {
  const { shootAtCursor } = useConfetti()
  const { playFallback } = useFallbackSound()
  const { tryPlay } = usePlayLocalIfExists()

  const filename = letterToFilename(letter)
  const src = `/sounds/english/alphabet/${filename}.mp3`

  // Bắn pháo bông
  shootAtCursor(event)

  if (await tryPlay(src))
    return

  // Nếu thất bại, fallback
  playFallback()
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-yellow-100 to-pink-100 p-4">
    <h1 class="text-3xl font-bold text-pink-600 text-center mb-6">
      🔤 Bảng Chữ Cái Tiếng Anh
    </h1>

    <div class="grid grid-cols-4 md:grid-cols-6 gap-4 max-w-4xl mx-auto">
      <div
        v-for="letter in alphabet"
        :key="`QiNhe${letter}`"
        class="bg-white rounded-xl shadow-md px-3 py-5 text-center text-5xl font-bold text-purple-600 cursor-pointer select-none transition-transform duration-200 active:scale-150"
        @click="(e) => playSound(e, letter)"
      >
        {{ letter }}
        <span class="text-2xl align-bottom text-gray-500 ml-1">{{ letter.toLowerCase() }}</span>
      </div>
    </div>
  </div>
</template>
