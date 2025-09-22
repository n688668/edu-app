<script lang="ts" setup>
import { Howl } from 'howler'
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

useHead({ title: 'Xếp hình' })

const canvas = ref<HTMLCanvasElement | null>(null)
const ctx = ref<CanvasRenderingContext2D | null>(null)
const gameOver = ref(false)

let pieces: any[] = []
let dragging: any = null
const pointerOffset = { x: 0, y: 0 }
let animationFrame = 0
let sourceImage: HTMLImageElement | null = null
const imageLoaded = ref(false)
const isLoading = ref(false)
const difficulty = ref<number>(2)
const orientation = ref<'portrait' | 'landscape'>('portrait')

function playSoundCorrect() {
  const sound = new Howl({
    src: '/sounds/correct.mp3',
  })
  sound.play()
}

function setupPieces() {
  if (!canvas.value || !sourceImage)
    return
  const c = canvas.value
  const cw = c.width
  const ch = c.height

  pieces = []
  const cols = difficulty.value
  const rows = difficulty.value
  const pw = Math.floor(cw / cols)
  const ph = Math.floor(ch / rows)

  let id = 0
  for (let r = 0; r < rows; r++) {
    for (let col = 0; col < cols; col++) {
      const sx = col * (sourceImage.width / cols)
      const sy = r * (sourceImage.height / rows)
      const piece = {
        id: id++,
        sx,
        sy,
        sw: sourceImage.width / cols,
        sh: sourceImage.height / rows,
        correctX: col * pw,
        correctY: r * ph,
        x: 0,
        y: 0,
        w: pw,
        h: ph,
        placed: false,
      }
      pieces.push(piece)
    }
  }

  for (const p of pieces) {
    const pad = 20
    p.x = Math.random() * (cw - p.w - pad * 2) + pad
    p.y = Math.random() * (ch - p.h - pad * 2) + pad
  }

  shufflePieces(false)
}

function shufflePieces(reshowPreview = true) {
  const coords = pieces.map(p => ({ x: p.x, y: p.y }))
  for (let i = coords.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = coords[i]
    coords[i] = coords[j]
    coords[j] = tmp
  }
  pieces.forEach((p, i) => {
    p.x = coords[i].x
    p.y = coords[i].y
    p.placed = false
  })
  if (reshowPreview)
    draw()
}

function draw(showPreview = false) {
  if (!ctx.value || !canvas.value || !sourceImage)
    return
  const context = ctx.value
  const c = canvas.value
  context.clearRect(0, 0, c.width, c.height)

  if (showPreview) {
    context.drawImage(sourceImage, 0, 0, c.width, c.height)
    return
  }

  context.save()
  context.globalAlpha = 0.25
  context.drawImage(sourceImage, 0, 0, c.width, c.height)
  context.globalAlpha = 1
  context.restore()

  for (const p of pieces) {
    context.save()
    context.beginPath()
    context.rect(p.x, p.y, p.w, p.h)
    context.clip()
    context.drawImage(
      sourceImage,
      p.sx,
      p.sy,
      p.sw,
      p.sh,
      p.x,
      p.y,
      p.w,
      p.h,
    )
    context.restore()

    context.strokeStyle = p.placed ? '#34d399' : '#ffffff'
    context.lineWidth = p.placed ? 4 : 2
    context.strokeRect(p.x + 0.5, p.y + 0.5, p.w - 1, p.h - 1)
  }

  if (dragging) {
    context.save()
    context.beginPath()
    context.rect(dragging.x, dragging.y, dragging.w, dragging.h)
    context.clip()
    context.drawImage(
      sourceImage,
      dragging.sx,
      dragging.sy,
      dragging.sw,
      dragging.sh,
      dragging.x,
      dragging.y,
      dragging.w,
      dragging.h,
    )
    context.restore()

    context.strokeStyle = '#f43f5e'
    context.lineWidth = 3
    context.strokeRect(dragging.x + 0.5, dragging.y + 0.5, dragging.w - 1, dragging.h - 1)
  }
}

function pointerToCanvas(e: PointerEvent) {
  if (!canvas.value)
    return { x: 0, y: 0 }
  const rect = canvas.value.getBoundingClientRect()
  return {
    x: (e.clientX - rect.left) * (canvas.value.width / rect.width),
    y: (e.clientY - rect.top) * (canvas.value.height / rect.height),
  }
}

function onPointerDown(e: PointerEvent) {
  if (!canvas.value)
    return
  const p = pointerToCanvas(e)
  for (let i = pieces.length - 1; i >= 0; i--) {
    const piece = pieces[i]
    if (
      p.x >= piece.x
      && p.x <= piece.x + piece.w
      && p.y >= piece.y
      && p.y <= piece.y + piece.h
      && !piece.placed
    ) {
      dragging = piece
      pieces.splice(i, 1)
      pieces.push(dragging)
      pointerOffset.x = p.x - dragging.x
      pointerOffset.y = p.y - dragging.y
      ;(canvas.value as any).setPointerCapture(e.pointerId)
      draw()
      return
    }
  }
}

function onPointerMove(e: PointerEvent) {
  if (!dragging)
    return
  const p = pointerToCanvas(e)
  dragging.x = p.x - pointerOffset.x
  dragging.y = p.y - pointerOffset.y
  draw()
}

function onPointerUp() {
  if (!dragging)
    return
  const snapThreshold = Math.max(dragging.w, dragging.h) * 0.35
  const dx = dragging.x - dragging.correctX
  const dy = dragging.y - dragging.correctY
  const dist = Math.hypot(dx, dy)
  if (dist < snapThreshold) {
    dragging.x = dragging.correctX
    dragging.y = dragging.correctY
    dragging.placed = true
    playSoundCorrect()
  }
  dragging = null
  draw()
  checkComplete()
}

function checkComplete() {
  if (pieces.every(p => p.placed)) {
    gameOver.value = true
  }
}

function restartGame() {
  gameOver.value = false
  nextTick(() => {
    if (!canvas.value || !sourceImage)
      return
    setupPieces()
    draw()
  })
}

function showPreview() {
  draw(true)
  setTimeout(() => draw(false), 1200)
}

function resizeCanvas() {
  if (!canvas.value)
    return
  const c = canvas.value
  const size = Math.min(window.innerWidth, window.innerHeight) * devicePixelRatio
  c.width = size
  c.height = size
  ctx.value = c.getContext('2d')
  orientation.value = window.innerWidth < window.innerHeight ? 'portrait' : 'landscape'
  if (sourceImage) {
    setupPieces()
    draw()
  }
}

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  if (!input.files || !input.files[0])
    return

  isLoading.value = true
  const file = input.files[0]
  const img = new Image()
  img.onload = () => {
    imageLoaded.value = true
    isLoading.value = false
    const side = Math.min(img.width, img.height)
    const sx = (img.width - side) / 2
    const sy = (img.height - side) / 2

    const tmp = document.createElement('canvas')
    tmp.width = side
    tmp.height = side
    const tctx = tmp.getContext('2d')!
    tctx.drawImage(img, sx, sy, side, side, 0, 0, side, side)

    const cropped = new Image()
    cropped.onload = () => {
      sourceImage = cropped
      resizeCanvas()
    }
    cropped.src = tmp.toDataURL()
  }
  img.onerror = () => {
    isLoading.value = false
  }
  img.src = URL.createObjectURL(file)
}

function updateOrientation() {
  orientation.value
    = window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
}

onMounted(() => {
  updateOrientation()
  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)

  if (!canvas.value)
    return
  const c = canvas.value
  c.addEventListener('pointerdown', onPointerDown)
  c.addEventListener('pointermove', onPointerMove)
  c.addEventListener('pointerup', onPointerUp)
  c.addEventListener('pointercancel', onPointerUp)

  c.style.touchAction = 'none'

  const loop = () => {
    animationFrame = requestAnimationFrame(loop)
  }
  loop()
})

onBeforeUnmount(() => {
  if (animationFrame)
    cancelAnimationFrame(animationFrame)
  if (canvas.value) {
    canvas.value.removeEventListener('pointerdown', onPointerDown)
    canvas.value.removeEventListener('pointermove', onPointerMove)
    canvas.value.removeEventListener('pointerup', onPointerUp)
    canvas.value.removeEventListener('pointercancel', onPointerUp)
  }
  window.removeEventListener('resize', resizeCanvas)
})
</script>

<template>
  <div
    class="relative flex items-center justify-center w-screen h-screen bg-gradient-to-br from-sky-100 via-blue-100 to-green-100"
  >
    <!-- Loading -->
    <LoadingScreen v-if="isLoading" />

    <!-- Nếu chưa chọn ảnh -->
    <div
      v-if="!imageLoaded && !isLoading"
      class="absolute inset-0 flex flex-col items-center justify-center z-20 text-center"
    >
      <h1 class="text-3xl font-bold text-gray-700 mb-6">
        Bé hãy chọn ảnh để chơi 📸
      </h1>
      <label
        class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg text-lg cursor-pointer"
      >
        Chọn ảnh
        <input
          type="file"
          accept="image/*"
          class="hidden"
          @change="onFileChange"
        >
      </label>
    </div>

    <!-- Canvas game -->
    <canvas v-show="imageLoaded" ref="canvas" class="touch-none z-10" />

    <SuccessMessage v-if="gameOver && imageLoaded" class="absolute inset-0 flex flex-col items-center justify-center z-20" @click="restartGame" />

    <!-- Controls -->
    <div
      v-if="imageLoaded"
      class="absolute z-30 flex bg-white/80 rounded-lg shadow p-3 gap-2"
      :class="
        orientation === 'portrait'
          ? 'bottom-4 left-1/2 -translate-x-1/2 flex-row'
          : 'right-4 top-1/2 -translate-y-1/2 flex-col'
      "
    >
      <label
        class="bg-blue-300 rounded px-3 py-2 shadow text-sm flex items-center gap-2 cursor-pointer"
      >
        <span class="text-sm">Chọn ảnh</span>
        <input
          type="file"
          accept="image/*"
          class="hidden"
          @change="onFileChange"
        >
      </label>

      <label
        class="bg-yellow-300 rounded px-3 py-2 bg-white shadow text-sm flex items-center gap-2"
      >
        <span class="text-sm">Độ khó</span>
        <select
          v-model.number="difficulty"
          class="ml-2 outline-none text-sm"
          @change="restartGame"
        >
          <option :value="2">2 x 2</option>
          <option :value="3">3 x 3</option>
          <option :value="4">4 x 4</option>
          <option :value="5">5 x 5</option>
        </select>
      </label>

      <button
        class="bg-pink-300 px-3 py-2 rounded shadow text-sm"
        @click="shufflePieces()"
      >
        Trộn
      </button>
      <button
        class="bg-green-300 px-3 py-2 rounded shadow text-sm"
        @click="showPreview()"
      >
        Xem mẫu
      </button>
    </div>
  </div>
</template>

<style scoped>
canvas {
  image-rendering: auto;
  max-width: 100vw;
  max-height: 100vh;
}
</style>
