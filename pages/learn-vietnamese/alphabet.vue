<script setup lang="ts">
import confetti from 'canvas-confetti'
import { Howl } from 'howler'

useHead({
  title: 'Bảng Chữ Cái Tiếng Việt',
})

const alphabet = [
  'A',
  'Ă',
  'Â',
  'B',
  'C',
  'D',
  'Đ',
  'E',
  'Ê',
  'G',
  'H',
  'I',
  'K',
  'L',
  'M',
  'N',
  'O',
  'Ô',
  'Ơ',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'Ư',
  'V',
  'X',
  'Y',
]

// Hàm chuyển ký tự tiếng Việt có dấu sang tên file không dấu
function letterToFilename(letter: string): string {
  const map: Record<string, string> = {
    Ă: 'aw',
    Â: 'aa',
    Ê: 'ee',
    Ô: 'oo',
    Ơ: 'ow',
    Ư: 'uw',
    Đ: 'dd',
  }

  const base = letter.toLowerCase()
  return map[letter] || base
}

// Phát âm chữ cái
function playSound(letter: string, event: MouseEvent) {
  const filename = letterToFilename(letter)
  const sound = new Howl({
    src: [`/sounds/vietnamese/alphabet/${filename}.mp3`],
  })
  sound.play()

  // Lấy tọa độ click trên màn hình để tạo pháo bông tại đó
  const x = event.clientX / window.innerWidth
  const y = event.clientY / window.innerHeight

  confetti({
    particleCount: 100,
    spread: 70,
    origin: { x, y },
  })
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-yellow-100 to-pink-100 p-4">
    <h1 class="text-3xl font-bold text-pink-600 text-center mb-6">
      🔤 Bảng Chữ Cái Tiếng Việt
    </h1>

    <div class="grid grid-cols-4 md:grid-cols-6 gap-4 max-w-4xl mx-auto">
      <div
        v-for="letter in alphabet"
        :key="`QiNjv${letter}`"
        class="bg-white rounded-xl shadow-md px-3 py-5 text-center text-5xl font-bold text-purple-600 cursor-pointer select-none transition-transform duration-200 active:scale-150"
        @click="(e) => playSound(letter, e)"
      >
        {{ letter }}
        <span class="text-2xl align-bottom text-gray-500 ml-1">{{ letter.toLowerCase() }}</span>
      </div>
    </div>
  </div>
</template>
