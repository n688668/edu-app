<script setup lang="ts">
import { Howl } from 'howler'

useHead({
  title: 'Học Hình Dạng Cơ Bản',
})

const shapes = [
  {
    name: 'Circle',
    bgClass: 'bg-pink-400',
    sound: '/sounds/circle.mp3',
  },
  {
    name: 'Square',
    bgClass: 'bg-blue-400',
    sound: '/sounds/square.mp3',
  },
  {
    name: 'Triangle',
    bgClass: 'bg-green-400',
    sound: '/sounds/triangle.mp3',
  },
  {
    name: 'Star',
    bgClass: 'bg-yellow-400',
    sound: '/sounds/star.mp3',
  },
  {
    name: 'Diamond',
    bgClass: 'bg-purple-400',
    sound: '/sounds/diamond.mp3',
  },
  {
    name: 'Ellipse',
    bgClass: 'bg-red-400',
    sound: '/sounds/ellipse.mp3',
  },
  {
    name: 'Trapezoid',
    bgClass: 'bg-indigo-400',
    sound: '/sounds/trapezoid.mp3',
  },
  {
    name: 'Pentagon',
    bgClass: 'bg-teal-400',
    sound: '/sounds/pentagon.mp3',
  },
  {
    name: 'Hexagon',
    bgClass: 'bg-orange-400',
    sound: '/sounds/hexagon.mp3',
  },
]

function playSound(src) {
  const sound = new Howl({ src: [src] })
  sound.play()
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 p-6">
    <h1 class="text-3xl font-bold text-purple-700 mb-6 text-center select-none">
      🎨 Học Hình Dạng Cơ Bản
    </h1>

    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
      <div
        v-for="shape in shapes"
        :key="`jJfGZ${shape.name}`"
        class="bg-white rounded-3xl shadow-lg p-6 flex flex-col items-center cursor-pointer transform transition active:scale-110"
        @click="playSound(shape.sound)"
      >
        <div :class="shape.bgClass" class="w-24 h-24 flex justify-center items-center rounded-xl mb-4">
          <svg v-if="shape.name === 'Circle'" viewBox="0 0 24 24" class="w-32 h-32">
            <circle cx="12" cy="12" r="10" fill="white" />
          </svg>
          <svg v-else-if="shape.name === 'Square'" viewBox="0 0 24 24" class="w-32 h-32">
            <rect x="6" y="6" width="12" height="12" fill="white" />
          </svg>
          <svg v-else-if="shape.name === 'Triangle'" viewBox="0 0 24 24" class="w-32 h-32">
            <polygon points="12,4 20,20 4,20" fill="white" />
          </svg>
          <svg v-else-if="shape.name === 'Star'" viewBox="0 0 24 24" class="w-32 h-32">
            <polygon points="12,2 15,10 23,10 17,14 19,22 12,17 5,22 7,14 1,10 9,10" fill="white" />
          </svg>

          <!-- Diamond (hình thoi) -->
          <svg v-else-if="shape.name === 'Diamond'" viewBox="0 0 24 24" class="w-32 h-32">
            <polygon points="12,2 22,12 12,22 2,12" fill="white" />
          </svg>

          <!-- Ellipse (hình elip) -->
          <svg v-else-if="shape.name === 'Ellipse'" viewBox="0 0 24 24" class="w-32 h-32">
            <ellipse cx="12" cy="12" rx="10" ry="6" fill="white" />
          </svg>

          <!-- Trapezoid (hình thang) -->
          <svg v-else-if="shape.name === 'Trapezoid'" viewBox="0 0 24 24" class="w-32 h-32">
            <polygon points="6,20 18,20 16,6 8,6" fill="white" />
          </svg>

          <!-- Pentagon (hình ngũ giác) -->
          <svg v-else-if="shape.name === 'Pentagon'" viewBox="0 0 24 24" class="w-32 h-32">
            <polygon points="12,3 20,9 16,20 8,20 4,9" fill="white" />
          </svg>

          <!-- Hexagon (hình lục giác) -->
          <svg v-else-if="shape.name === 'Hexagon'" viewBox="0 0 24 24" class="w-32 h-32">
            <polygon points="6,4 18,4 22,12 18,20 6,20 2,12" fill="white" />
          </svg>
        </div>

        <div class="text-3xl font-semibold text-purple-800 select-none">
          {{ shape.name }}
        </div>
      </div>
    </div>
  </div>
</template>
