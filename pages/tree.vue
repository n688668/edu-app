<script lang="ts" setup>
import { Howl } from 'howler'
import { onMounted, ref } from 'vue'

useHead({ title: 'Trồng cây' })

const canvas = ref<HTMLCanvasElement | null>(null)
const ctx = ref<CanvasRenderingContext2D | null>(null)
const orientation = ref<'portrait' | 'landscape'>('portrait')

// stages & states
const stages = ['seed', 'sapling', 'tree', 'flower', 'fruit']
const state = ref(0)
const health = ref<'normal' | 'good' | 'bad'>('normal')
const images: Record<string, HTMLImageElement> = {}

// hiệu ứng hạt nước
interface Drop {
  x: number
  y: number
  speed: number
  radius: number
}
let drops: Drop[] = []
let wateringInProgress = false

// hiệu ứng ripple (highlight)
interface Ripple {
  x: number
  y: number
  radius: number
  alpha: number
}
let ripples: Ripple[] = []

function playSound(file: string) {
  const sound = new Howl({ src: `/sounds/${file}.mp3` })
  sound.play()
}

function loadImages(onDone: () => void) {
  let loaded = 0
  const total = stages.length * 3
  stages.forEach((stage) => {
    ;['normal', 'good', 'bad'].forEach((status) => {
      const img = new Image()
      img.src = `/images/${stage}-${status}.png`
      img.onload = () => {
        loaded++
        if (loaded === total)
          onDone()
      }
      images[`${stage}-${status}`] = img
    })
  })
}

function draw() {
  if (!ctx.value || !canvas.value)
    return
  const context = ctx.value
  const cvs = canvas.value
  context.clearRect(0, 0, cvs.width, cvs.height)

  // vẽ cây
  const key = `${stages[state.value]}-${health.value}`
  const img = images[key]
  if (img) {
    const scale = Math.min(cvs.width / img.width, cvs.height / img.height)
    const newW = img.width * scale
    const newH = img.height * scale
    const x = (cvs.width - newW) / 2
    const y = (cvs.height - newH) / 2
    context.drawImage(img, x, y, newW, newH)
  }

  // vẽ giọt nước
  context.fillStyle = 'rgba(0,150,255,0.7)'
  drops.forEach((d) => {
    context.beginPath()
    context.ellipse(d.x, d.y, d.radius * 0.7, d.radius, 0, 0, Math.PI * 2)
    context.fill()
  })

  // vẽ ripple (highlight)
  ripples.forEach((r) => {
    context.beginPath()
    context.arc(r.x, r.y, r.radius, 0, Math.PI * 2)
    context.strokeStyle = `rgba(0,150,255,${r.alpha})`
    context.lineWidth = 3
    context.stroke()
  })
}

function animate() {
  if (!canvas.value)
    return
  const cvs = canvas.value
  const midY = cvs.height / 2

  // update drops
  drops.forEach((d) => {
    d.y += d.speed
  })
  drops = drops.filter(d => d.y < midY)

  // update ripples
  ripples.forEach((r) => {
    r.radius += 3
    r.alpha -= 0.02
  })
  ripples = ripples.filter(r => r.alpha > 0)

  // khi tưới và tất cả giọt nước biến mất → đổi trạng thái cây
  if (wateringInProgress && drops.length === 0) {
    wateringInProgress = false
    health.value = 'good'
    if (state.value < stages.length - 1) {
      state.value++
    }
  }

  draw()
  requestAnimationFrame(animate)
}

function resizeCanvas() {
  if (!canvas.value)
    return
  const cvs = canvas.value
  cvs.width = window.innerWidth
  cvs.height = window.innerHeight
  orientation.value
    = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
  draw()
}

function waterPlant(x: number, y: number) {
  if (wateringInProgress)
    return
  playSound('water')
  wateringInProgress = true

  // ripple highlight tại vị trí click
  ripples.push({ x, y, radius: 0, alpha: 0.6 })

  if (canvas.value) {
    const centerX = canvas.value.width / 2
    for (let i = 0; i < 20; i++) {
      drops.push({
        x: centerX + (Math.random() * 200 - 100), // tán rộng hơn quanh giữa cây
        y: 0, // bắt đầu từ trên cùng
        speed: 4 + Math.random() * 2,
        radius: 5 + Math.random() * 3,
      })
    }
  }
}

function resetGame() {
  state.value = 0
  health.value = 'normal'
  drops = []
  wateringInProgress = false
  ripples = []
  draw()
}

onMounted(() => {
  if (canvas.value) {
    ctx.value = canvas.value.getContext('2d')
    canvas.value.addEventListener('click', (e) => {
      if (state.value < stages.length - 1) {
        waterPlant(e.offsetX, e.offsetY)
      }
    })
  }
  resizeCanvas()
  loadImages(() => draw())
  animate()
  window.addEventListener('resize', resizeCanvas)
})
</script>

<template>
  <div
    class="relative flex items-center justify-center w-screen h-screen bg-gradient-to-br from-sky-100 via-blue-100 to-green-100"
  >
    <canvas ref="canvas" class="touch-none z-10" />

    <!-- Controls -->
    <div
      class="absolute z-30 flex p-3 gap-2"
      :class="orientation === 'portrait'
        ? 'bottom-4 left-1/2 -translate-x-1/2 flex-row'
        : 'right-4 top-1/2 -translate-y-1/2 flex-col'"
    >
      <button
        v-if="state >= stages.length - 1"
        class="px-8 py-4 text-2xl font-bold bg-pink-500 text-white rounded-full shadow-lg hover:bg-pink-600 transition duration-300 active:scale-95"
        @click="resetGame"
      >
        🔁 Chơi Lại
      </button>
    </div>
  </div>
</template>

<style scoped>
canvas {
  image-rendering: auto;
  width: 100vw;
  height: 100vh;
}
</style>
