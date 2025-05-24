<script setup lang="ts">
import { Howl } from 'howler'

useHead({
  title: 'Số Đếm (Numbers)',
})

// Danh sách số từ 1 đến 10
const baseColors = [
  '#f44336',
  '#e91e63',
  '#9c27b0',
  '#3f51b5',
  '#2196f3',
  '#03a9f4',
  '#00bcd4',
  '#4caf50',
  '#8bc34a',
  '#ff9800',
  '#ff5722',
  '#795548',
]

function numToEnglish(n: number): string {
  const ones = [
    'zero',
    'one',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
    'eight',
    'nine',
  ]
  const teens = [
    'ten',
    'eleven',
    'twelve',
    'thirteen',
    'fourteen',
    'fifteen',
    'sixteen',
    'seventeen',
    'eighteen',
    'nineteen',
  ]
  const tens = [
    '',
    '',
    'twenty',
    'thirty',
    'forty',
    'fifty',
    'sixty',
    'seventy',
    'eighty',
    'ninety',
  ]

  if (n < 10)
    return ones[n]
  if (n < 20)
    return teens[n - 10]
  if (n % 10 === 0)
    return tens[Math.floor(n / 10)]
  return `${tens[Math.floor(n / 10)]}-${ones[n % 10]}`
}

const numbers = Array.from({ length: 101 }, (_, i) => ({
  label: String(i),
  text: numToEnglish(i),
  sound: `/sounds/english/numbers/en_num_${i}.mp3`,
  color: baseColors[i % baseColors.length],
}))

function playSound(number: any) {
  const sound = new Howl({
    src: [number.sound],
  })
  sound.play()
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-100 to-pink-100 p-4">
    <h1 class="text-3xl font-bold text-blue-600 text-center mb-6">
      🔢 Số Đếm (Numbers)
    </h1>

    <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
      <div
        v-for="number in numbers"
        :key="`qXLpa${number.label}`"
        :style="{ backgroundColor: number.color }"
        class="rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center cursor-pointer active:scale-110 transition"
        @click="playSound(number)"
      >
        <span class="text-white text-5xl font-bold drop-shadow-md">
          {{ number.label }}
        </span>
        <span class="text-white text-3xl mt-2 capitalize drop-shadow-md">
          {{ number.text }}
        </span>
      </div>
    </div>
  </div>
</template>
