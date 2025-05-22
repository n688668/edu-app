<script setup lang="ts">
import { onMounted, ref } from 'vue'

useHead({
  title: 'Tập viết chữ',
})

const alphabet = 'AĂÂBCDĐEÊGHIKLMNOÔƠPQRSTUƯVXYaăâbcdđeêghiklmnôơpqrstưvxyabcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('')

const selectedChar = ref('A')
const showCanvas = ref(false)
const canvasRef = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null
let isDrawing = false

onMounted(() => {
  if (canvasRef.value) {
    ctx = canvasRef.value.getContext('2d')
    if (ctx) {
      ctx.lineWidth = 5
      ctx.lineCap = 'round'
      ctx.strokeStyle = '#f59e0b'
    }
  }
})

function selectChar(char: string) {
  selectedChar.value = char
  showCanvas.value = true
  clearCanvas()
}

// Mouse events
function startDraw(e: MouseEvent) {
  if (!ctx)
    return
  isDrawing = true
  ctx.beginPath()
  ctx.moveTo(e.offsetX, e.offsetY)
}
function draw(e: MouseEvent) {
  if (!isDrawing || !ctx)
    return
  ctx.lineTo(e.offsetX, e.offsetY)
  ctx.stroke()
}
function stopDraw() {
  isDrawing = false
}

// Touch events (mobile)
function startDrawTouch(e: TouchEvent) {
  if (!ctx || !canvasRef.value)
    return
  const rect = canvasRef.value.getBoundingClientRect()
  const touch = e.touches[0]
  ctx.beginPath()
  ctx.moveTo(touch.clientX - rect.left, touch.clientY - rect.top)
  isDrawing = true
}
function drawTouch(e: TouchEvent) {
  if (!ctx || !isDrawing || !canvasRef.value)
    return
  const rect = canvasRef.value.getBoundingClientRect()
  const touch = e.touches[0]
  ctx.lineTo(touch.clientX - rect.left, touch.clientY - rect.top)
  ctx.stroke()
}
function clearCanvas() {
  if (ctx && canvasRef.value) {
    ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
  }
}

// Màu sinh động cho các chữ cái
function getColorClass(char: string) {
  const colors = [
    'bg-gradient-to-br from-pink-400 to-pink-600',
    'bg-gradient-to-br from-blue-400 to-blue-600',
    'bg-gradient-to-br from-green-400 to-green-600',
    'bg-gradient-to-br from-yellow-400 to-yellow-600',
    'bg-gradient-to-br from-purple-400 to-purple-600',
    'bg-gradient-to-br from-orange-400 to-orange-500',
    'bg-gradient-to-br from-red-400 to-red-600',
  ]
  const index = char.charCodeAt(0) % colors.length
  return colors[index]
}

function goBackToAlphabet() {
  showCanvas.value = false
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-yellow-100 to-pink-100 p-6">
    <h1 class="text-3xl font-bold text-pink-600 text-center mb-6">
      ✍️ Tập viết chữ
    </h1>

    <!-- Danh sách chữ cái -->
    <div v-if="!showCanvas" class="flex flex-wrap justify-center gap-3 mb-6">
      <button
        v-for="char in alphabet"
        :key="`vPDFa${char}`"
        class="text-3xl font-bold text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110"
        :class="getColorClass(char)"
        @click="selectChar(char)"
      >
        {{ char }}
      </button>
    </div>

    <!-- Chữ đang chọn -->
    <div v-show="showCanvas" class="text-center mb-4">
      <h2 class="text-2xl font-bold text-yellow-700">
        Viết chữ: <span class="text-5xl">{{ selectedChar }}</span>
      </h2>
      <button
        class="mt-4 px-6 py-3 bg-blue-400 hover:bg-blue-500 text-white rounded-full font-bold shadow-md text-xl"
        @click="goBackToAlphabet"
      >
        Quay lại Bảng chữ cái
      </button>
    </div>

    <!-- Khung viết -->
    <div v-show="showCanvas" class="flex justify-center">
      <canvas
        ref="canvasRef"
        width="400"
        height="400"
        class="border-4 border-yellow-400 rounded-xl bg-white"
        @mousedown="startDraw"
        @mousemove="draw"
        @mouseup="stopDraw"
        @mouseleave="stopDraw"
        @touchstart.prevent="startDrawTouch"
        @touchmove.prevent="drawTouch"
        @touchend="stopDraw"
      />
    </div>

    <!-- Nút xóa -->
    <div v-show="showCanvas" class="flex justify-center mt-6">
      <button
        class="px-6 py-3 bg-red-400 hover:bg-red-500 text-white text-xl rounded-full font-bold shadow-md transition"
        @click="clearCanvas"
      >
        Xóa
      </button>
    </div>
  </div>
</template>
