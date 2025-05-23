<script lang="ts" setup>
const props = defineProps<{
  data?: any
}>()

const canvas = ref<HTMLCanvasElement | null>(null)
const gameOver = ref(false)
const canvasHeight = ref(0)

let ctx: CanvasRenderingContext2D
let width: number, height: number
let bubbles: any[] = []
let particles: any[] = []
let alphabet: string[] = []
let currentIndex = 0
const colors = ['#ff6b6b', '#6bcBef', '#ffe66d', '#48dbfb', '#1dd1a1', '#f368e0']

function createBubble(letter: string) {
  const angle = Math.random() * Math.PI * 2
  const speed = 10 + Math.random() * 5
  const normalSpeed = 0.5 + Math.random() * 1.5

  const isMobile = window.innerWidth < 768
  const baseRadius = isMobile ? 25 : 40
  const radiusVariation = isMobile ? 10 : 20

  return {
    letter,
    x: width / 2,
    y: height / 2,
    radius: baseRadius + Math.random() * radiusVariation,
    color: colors[Math.floor(Math.random() * colors.length)],
    dx: Math.cos(angle) * speed,
    dy: Math.sin(angle) * speed,
    normalSpeed,
    isPopped: false,
    popTime: 0,
    decelerated: false,
  }
}

function createParticles(x: number, y: number, color: string) {
  for (let i = 0; i < 12; i++) {
    const angle = Math.random() * Math.PI * 2
    const speed = 2 + Math.random() * 3
    particles.push({
      x,
      y,
      dx: Math.cos(angle) * speed,
      dy: Math.sin(angle) * speed,
      life: 30 + Math.random() * 10,
      color,
    })
  }
}

function drawBubble(b: any) {
  if (b.isPopped)
    return
  const gradient = ctx.createRadialGradient(b.x - b.radius * 0.3, b.y - b.radius * 0.3, b.radius * 0.1, b.x, b.y, b.radius)
  gradient.addColorStop(0, '#ffffffcc')
  gradient.addColorStop(1, b.color)

  ctx.beginPath()
  ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2)
  ctx.fillStyle = gradient
  ctx.shadowColor = b.color
  ctx.shadowBlur = 10
  ctx.fill()

  ctx.fillStyle = '#000'
  ctx.font = `${b.radius * 0.8}px sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(b.letter, b.x, b.y)
  ctx.shadowBlur = 0
}

function drawParticles() {
  particles.forEach((p) => {
    ctx.beginPath()
    ctx.arc(p.x, p.y, 3, 0, Math.PI * 2)
    ctx.fillStyle = p.color
    ctx.fill()
  })
}

function updateBubbles() {
  bubbles.forEach((b) => {
    if (b.isPopped)
      return
    b.x += b.dx
    b.y += b.dy

    if (!b.decelerated) {
      b.dx *= 0.95
      b.dy *= 0.95
      if (Math.abs(b.dx) < b.normalSpeed && Math.abs(b.dy) < b.normalSpeed) {
        const angle = Math.atan2(b.dy, b.dx)
        b.dx = Math.cos(angle) * b.normalSpeed
        b.dy = Math.sin(angle) * b.normalSpeed
        b.decelerated = true
      }
    }

    if (b.x - b.radius < 0 || b.x + b.radius > width)
      b.dx *= -1
    if (b.y - b.radius < 0 || b.y + b.radius > height)
      b.dy *= -1
  })
}

function updateParticles() {
  particles = particles.filter(p => p.life > 0)
  particles.forEach((p) => {
    p.x += p.dx
    p.y += p.dy
    p.life--
  })
}

function animate() {
  ctx.clearRect(0, 0, width, height)
  updateBubbles()
  updateParticles()
  bubbles.forEach(drawBubble)
  drawParticles()
  requestAnimationFrame(animate)
}

function handleClick(e: MouseEvent) {
  const rect = canvas.value!.getBoundingClientRect()
  const clickX = e.clientX - rect.left
  const clickY = e.clientY - rect.top

  for (let i = 0; i < bubbles.length; i++) {
    const b = bubbles[i]
    const dist = Math.hypot(b.x - clickX, b.y - clickY)
    if (!b.isPopped && dist < b.radius) {
      if (b.letter === alphabet[currentIndex]) {
        b.isPopped = true
        createParticles(b.x, b.y, b.color)
        b.popTime = Date.now()
        currentIndex++
        if (currentIndex >= alphabet.length) {
          gameOver.value = true
        }
      }
      break
    }
  }
}

function restartGame() {
  gameOver.value = false
  currentIndex = 0
  bubbles = alphabet.map(createBubble)
  particles = []
}

onMounted(() => {
  canvasHeight.value = window.innerHeight - 100
  alphabet = props?.data?.split('') || []
  ctx = canvas.value!.getContext('2d')!
  width = canvas.value!.width = window.innerWidth
  height = canvas.value!.height = canvasHeight.value
  bubbles = alphabet.map(createBubble)
  window.addEventListener('click', handleClick)
  animate()
})

onUnmounted(() => {
  window.removeEventListener('click', handleClick)
})
</script>

<template>
  <div class="relative overflow-hidden bg-gradient-to-br from-sky-100 via-blue-100 to-green-100" :style="{ height: `${canvasHeight}px` }">
    <canvas ref="canvas" class="absolute top-0 left-0 w-full h-full" />

    <SuccessMessage v-if="gameOver" message="Bé đã hoàn thành rồi!" class="absolute inset-0 flex flex-col items-center justify-center" @click="restartGame" />
  </div>
</template>

<style scoped>
canvas {
  touch-action: manipulation;
  display: block;
  background-color: transparent;
}
</style>
