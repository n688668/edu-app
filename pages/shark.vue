<script lang="ts" setup>
import { Howl } from 'howler'

useHead({
  title: 'Cá mập ăn chữ',
})

const data = ref('012345679AĂÂBCDĐEÊGHIKLMNOÔƠPQRSTUƯVXY')

let correctSound: Howl | null = null
let wrongSound: Howl | null = null

const canvas = ref<HTMLCanvasElement | null>(null)
const gameOver = ref(false)
const canvasHeight = ref(0)
let userInteracted = false

let ctx: CanvasRenderingContext2D
let width: number, height: number
let bubbles: any[] = []
let particles: any[] = []
let alphabet: string[] = []
let currentIndex = 0
const colors = ['#ff6b6b', '#6bcBef', '#ffe66d', '#48dbfb', '#1dd1a1', '#f368e0']

// Cá mập
let sharkImg: HTMLImageElement
const shark: any = {
  x: 0,
  y: 0,
  dx: 0,
  dy: 0,
  speed: 4,
  angle: 0,
  target: null as any,
}

function createBubble(letter: string) {
  const angle = Math.random() * Math.PI * 2
  const speed = 10 + Math.random() * 5
  const normalSpeed = 0.5 + Math.random() * 1.5

  const fewBubbles = alphabet.length <= 10
  let baseRadius = 60
  let radiusVariation = 30

  if (fewBubbles) {
    baseRadius = 75
    radiusVariation = 25
  }
  else if (window.innerWidth < 768) {
    baseRadius = 50
    radiusVariation = 20
  }

  return {
    letter,
    x: width / 2,
    y: height / 2,
    radius: baseRadius + Math.random() * radiusVariation,
    baseRadius,
    scale: 1,
    color: colors[Math.floor(Math.random() * colors.length)],
    dx: Math.cos(angle) * speed,
    dy: Math.sin(angle) * speed,
    normalSpeed,
    isPopped: false,
    popTime: 0,
    decelerated: false,
    isWrong: false,
    wrongTimer: 0,
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

  ctx.save()
  ctx.translate(b.x, b.y)
  ctx.scale(b.scale, b.scale)

  const gradient = ctx.createRadialGradient(
    -b.radius * 0.3,
    -b.radius * 0.3,
    b.radius * 0.1,
    0,
    0,
    b.radius,
  )
  gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)')
  gradient.addColorStop(1, `rgba(${hexToRgb(b.color)}, 0.7)`)

  ctx.beginPath()
  ctx.arc(0, 0, b.radius, 0, Math.PI * 2)
  ctx.fillStyle = gradient
  ctx.shadowColor = b.color
  ctx.shadowBlur = 10
  ctx.fill()

  ctx.fillStyle = 'rgba(0,0,0,0.8)'
  ctx.font = `${b.radius * 0.8}px sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(b.letter, 0, 0)

  ctx.restore()
  ctx.shadowBlur = 0
}

function hexToRgb(hex: string) {
  const bigint = Number.parseInt(hex.replace('#', ''), 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return `${r},${g},${b}`
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

    if (b.isWrong) {
      b.scale = 1 + 0.2 * Math.sin((120 - b.wrongTimer) / 5)
      b.wrongTimer--
      if (b.wrongTimer <= 0) {
        b.isWrong = false
        b.scale = 1
        const angle = Math.atan2(b.dy, b.dx)
        b.dx = Math.cos(angle) * b.normalSpeed
        b.dy = Math.sin(angle) * b.normalSpeed
      }
    }
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

// 🚩 Update cá mập
// 🚩 Update cá mập
// 🚩 Update cá mập
let sharkWanderTimer = 0
let sharkWaveTime = 0

function updateShark() {
  if (shark.target && !shark.target.isPopped) {
    const dx = shark.target.x - shark.x
    const dy = shark.target.y - shark.y
    const dist = Math.hypot(dx, dy)

    if (dist < shark.target.radius) {
      // Chạm bóng → nổ
      shark.target.isPopped = true
      createParticles(shark.target.x, shark.target.y, shark.target.color)
      correctSound?.play()
      currentIndex++
      setTimeout(nextRound, 400)
      shark.target = null
      shark.dx = 0
      shark.dy = 0
    }
    else {
      shark.dx = (dx / dist) * shark.speed
      shark.dy = (dy / dist) * shark.speed
      shark.x += shark.dx
      shark.y += shark.dy
      shark.angle = Math.atan2(dy, dx)
    }
  }
  else {
    // 🚩 Chế độ bơi tự do (không có target)
    if (sharkWanderTimer <= 0) {
      const angle = Math.random() * Math.PI * 2
      shark.dx = Math.cos(angle) * (1 + Math.random() * 0.5)
      shark.dy = Math.sin(angle) * (1 + Math.random() * 0.5)
      sharkWanderTimer = 120 + Math.random() * 120 // 2–4 giây
    }
    sharkWanderTimer--

    shark.x += shark.dx
    shark.y += shark.dy

    // lượn sóng nhẹ
    sharkWaveTime += 0.05
    const baseAngle = Math.atan2(shark.dy, shark.dx)
    const waveOffset = Math.sin(sharkWaveTime) * 0.2 // biên độ ~0.2 rad ≈ 11°
    shark.angle = baseAngle + waveOffset

    // tránh cá mập bơi ra ngoài màn hình
    if (shark.x < 50 || shark.x > width - 50)
      shark.dx *= -1
    if (shark.y < 50 || shark.y > height - 50)
      shark.dy *= -1
  }
}

// 🚩 Vẽ cá mập
// 🚩 Vẽ cá mập
function drawShark() {
  if (!sharkImg.complete)
    return

  ctx.save()
  ctx.translate(shark.x, shark.y)

  // Xoay theo hướng bơi
  ctx.rotate(shark.angle)

  // Nếu bơi sang trái (dx < 0) → lật dọc để bụng luôn ở dưới
  if (shark.dx < 0) {
    ctx.scale(1, -1)
  }

  const size = 120
  ctx.drawImage(sharkImg, -size / 2, -size / 2, size, size)

  ctx.restore()
}

function animate() {
  ctx.clearRect(0, 0, width, height)
  updateBubbles()
  updateParticles()
  updateShark()

  bubbles.forEach(drawBubble)
  drawParticles()
  drawShark()

  // vẽ chữ cái target mờ nền
  ctx.save()
  ctx.font = `${Math.min(width, height) * 0.25}px sans-serif`
  ctx.fillStyle = 'rgba(100, 100, 255, 0.1)'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(alphabet[currentIndex] || '', width / 2, height / 2)
  ctx.restore()

  requestAnimationFrame(animate)
}

function getThreeBubblesForCurrent() {
  const correctLetter = alphabet[currentIndex]
  const otherLetters: string[] = alphabet.filter((l, i) => i !== currentIndex)
  const wrongLetters: string[] = []

  while (wrongLetters.length < 2 && otherLetters.length > 0) {
    const idx = Math.floor(Math.random() * otherLetters.length)
    wrongLetters.push(otherLetters.splice(idx, 1)[0])
  }

  const letters = [correctLetter, ...wrongLetters]
  const shuffled = letters.sort(() => Math.random() - 0.5)
  return shuffled.map(createBubble)
}

function shuffleArray<T>(arr: T[]): T[] {
  return arr
    .map(v => ({ v, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ v }) => v)
}

function nextRound() {
  if (currentIndex >= alphabet.length) {
    gameOver.value = true
    return
  }
  bubbles = getThreeBubblesForCurrent()
}

function handleClick(e: MouseEvent) {
  if (!correctSound) {
    correctSound = new Howl({ src: ['/sounds/tap.mp3'], volume: 1.5 })
  }
  if (!wrongSound) {
    wrongSound = new Howl({ src: ['/sounds/sci-fi-bubble-pop.mp3'], volume: 1.5 })
  }

  const rect = canvas.value!.getBoundingClientRect()
  const clickX = e.clientX - rect.left
  const clickY = e.clientY - rect.top

  for (let i = 0; i < bubbles.length; i++) {
    const b = bubbles[i]
    const dist = Math.hypot(b.x - clickX, b.y - clickY)
    if (!b.isPopped && dist < b.radius) {
      if (b.letter === alphabet[currentIndex]) {
        shark.target = b // cá mập bơi tới bóng đúng
        return
      }
      else {
        wrongSound.play()
        b.isWrong = true
        b.wrongTimer = 120
      }
    }
  }
}

function restartGame() {
  gameOver.value = false
  currentIndex = 0
  particles = []
  nextRound()
}

function resize() {
  canvasHeight.value = window.innerHeight
  width = window.innerWidth
  height = canvasHeight.value

  if (canvas.value) {
    canvas.value.width = width
    canvas.value.height = height
    ctx = canvas.value.getContext('2d')!
  }

  bubbles.forEach((b) => {
    b.x = Math.min(Math.max(b.x, b.radius), width - b.radius)
    b.y = Math.min(Math.max(b.y, b.radius), height - b.radius)
  })
}

onMounted(() => {
  alphabet = data.value?.split('') || []
  alphabet = shuffleArray(alphabet)

  ctx = canvas.value!.getContext('2d')!
  resize()
  window.addEventListener('click', handleClick)
  window.addEventListener('resize', resize)

  // load shark
  sharkImg = new Image()
  sharkImg.src = '/svg/shark.svg'
  shark.x = width / 2
  shark.y = height / 2

  // Bắt đầu sau tương tác đầu tiên
  const waitForInteraction = () => {
    if (!userInteracted) {
      userInteracted = true
      window.removeEventListener('click', waitForInteraction)
      window.removeEventListener('touchstart', waitForInteraction)
      restartGame()
    }
  }
  window.addEventListener('click', waitForInteraction)
  window.addEventListener('touchstart', waitForInteraction)

  animate()
})

onUnmounted(() => {
  window.removeEventListener('click', handleClick)
  window.removeEventListener('resize', resize)
})
</script>

<template>
  <div
    class="relative overflow-hidden bg-gradient-to-br from-sky-100 via-blue-100 to-green-100 pt-16"
    :style="{ height: `${canvasHeight}px` }"
  >
    <canvas ref="canvas" class="absolute top-0 left-0 w-full h-full" />
    <SuccessMessage
      v-if="gameOver"
      message="Bé đã hoàn thành rồi!"
      class="absolute inset-0 flex flex-col items-center justify-center"
      @click="restartGame"
    />
  </div>
</template>

<style scoped>
canvas {
  touch-action: manipulation;
  display: block;
  background-color: transparent;
}
</style>
