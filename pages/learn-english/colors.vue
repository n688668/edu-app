<script setup lang="ts">
useHead({
  title: 'Màu Sắc (Colors)',
})

const colors = [
  { name: 'Red', hex: '#f44336', sound: '/sounds/english/words/red.mp3' },
  { name: 'Blue', hex: '#2196f3', sound: '/sounds/english/words/blue.mp3' },
  { name: 'Green', hex: '#4caf50', sound: '/sounds/english/words/green.mp3' },
  { name: 'Yellow', hex: '#ffeb3b', sound: '/sounds/english/words/yellow.mp3' },
  { name: 'Purple', hex: '#9c27b0', sound: '/sounds/english/words/purple.mp3' },
  { name: 'Orange', hex: '#ff9800', sound: '/sounds/english/words/orange.mp3' },
  { name: 'Pink', hex: '#e91e63', sound: '/sounds/english/words/pink.mp3' },
  { name: 'Brown', hex: '#795548', sound: '/sounds/english/words/brown.mp3' },
  { name: 'Black', hex: '#000000', sound: '/sounds/english/words/black.mp3' },
  { name: 'White', hex: '#ffffff', sound: '/sounds/english/words/white.mp3' },
  { name: 'Gray', hex: '#9e9e9e', sound: '/sounds/english/words/gray.mp3' },
  { name: 'Cyan', hex: '#00bcd4', sound: '/sounds/english/words/cyan.mp3' },
  { name: 'Lime', hex: '#cddc39', sound: '/sounds/english/words/lime.mp3' },
  { name: 'Teal', hex: '#009688', sound: '/sounds/english/words/teal.mp3' },
  { name: 'Indigo', hex: '#3f51b5', sound: '/sounds/english/words/indigo.mp3' },
]

function shuffleArray(array: any) {
  return array
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)
}

const shuffledColors = ref(colors)

onMounted(() => {
  shuffledColors.value = shuffleArray(colors)
})

async function playSound(event: MouseEvent, color: any) {
  const { shootAtCursor } = useConfetti()
  const { playFallback } = useFallbackSound()
  const { tryPlay } = usePlayLocalIfExists()

  // Bắn pháo bông
  shootAtCursor(event)

  if (await tryPlay(color.sound))
    return

  // Nếu thất bại, fallback
  playFallback()
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-pink-100 to-yellow-100 p-4">
    <h1 class="text-3xl font-bold text-red-500 text-center mb-6">
      🎨 Màu Sắc (Colors)
    </h1>

    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
      <div
        v-for="color in shuffledColors"
        :key="`LpYaF${color.name}`"
        :style="{ backgroundColor: color.hex }"
        class="rounded-2xl shadow-lg px-6 py-8 flex items-center justify-center cursor-pointer active:scale-110 transition"
        @click="(e) => playSound(e, color)"
      >
        <span class="text-white text-3xl font-bold drop-shadow-md">
          {{ color.name }}
        </span>
      </div>
    </div>
  </div>
</template>
