<script setup lang="ts">
import { Howl } from 'howler'

useHead({
  title: 'Màu Sắc (Colors)',
})

const colors = [
  { name: 'Red', hex: '#f44336', sound: '/sounds/english/colors/red.mp3' },
  { name: 'Blue', hex: '#2196f3', sound: '/sounds/english/colors/blue.mp3' },
  { name: 'Green', hex: '#4caf50', sound: '/sounds/english/colors/green.mp3' },
  { name: 'Yellow', hex: '#ffeb3b', sound: '/sounds/english/colors/yellow.mp3' },
  { name: 'Purple', hex: '#9c27b0', sound: '/sounds/english/colors/purple.mp3' },
  { name: 'Orange', hex: '#ff9800', sound: '/sounds/english/colors/orange.mp3' },
  { name: 'Pink', hex: '#e91e63', sound: '/sounds/english/colors/pink.mp3' },
  { name: 'Brown', hex: '#795548', sound: '/sounds/english/colors/brown.mp3' },
  { name: 'Black', hex: '#000000', sound: '/sounds/english/colors/black.mp3' },
  { name: 'White', hex: '#ffffff', sound: '/sounds/english/colors/white.mp3' },
  { name: 'Gray', hex: '#9e9e9e', sound: '/sounds/english/colors/gray.mp3' },
  { name: 'Cyan', hex: '#00bcd4', sound: '/sounds/english/colors/cyan.mp3' },
  { name: 'Lime', hex: '#cddc39', sound: '/sounds/english/colors/lime.mp3' },
  { name: 'Teal', hex: '#009688', sound: '/sounds/english/colors/teal.mp3' },
  { name: 'Indigo', hex: '#3f51b5', sound: '/sounds/english/colors/indigo.mp3' },
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

function playSound(color) {
  const sound = new Howl({
    src: [color.sound],
  })
  sound.play()
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
        @click="playSound(color)"
      >
        <span class="text-white text-3xl font-bold drop-shadow-md">
          {{ color.name }}
        </span>
      </div>
    </div>
  </div>
</template>
