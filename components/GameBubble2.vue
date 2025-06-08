<script lang="ts" setup>
import { Howl } from 'howler'

const props = defineProps<{
  data?: any
}>()

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

function createBubble(letter: string) {
  const angle = Math.random() * Math.PI * 2
  const speed = 10 + Math.random() * 5
  const normalSpeed = 0.5 + Math.random() * 1.5

  const fewBubbles = alphabet.length <= 10
  let baseRadius = 60
  let radiusVariation = 30

  // Nếu ít chữ cái thì tăng kích thước, bất kể thiết bị
  if (fewBubbles) {
    baseRadius = 55
    radiusVariation = 25
  }
  else if (window.innerWidth < 768) {
    // Trường hợp mobile nhiều chữ cái
    baseRadius = 25
    radiusVariation = 20
  }

  return {
    letter,
    x: width / 2,
    y: height / 2,
    radius: baseRadius + Math.random() * radiusVariation,
    baseRadius, // Lưu lại kích thước ban đầu
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
  gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)') // phần trong suốt hơn
  gradient.addColorStop(1, `rgba(${hexToRgb(b.color)}, 0.7)`) // màu bong bóng mờ đi

  ctx.beginPath()
  ctx.arc(0, 0, b.radius, 0, Math.PI * 2)
  ctx.fillStyle = gradient
  ctx.shadowColor = b.color
  ctx.shadowBlur = 10
  ctx.fill()

  ctx.fillStyle = 'rgba(0,0,0,0.8)' // chữ hơi mờ cho nhẹ nhàng hơn
  ctx.font = `${b.radius * 0.8}px sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(b.letter, 0, 0)

  ctx.restore()
  ctx.shadowBlur = 0
}

// Hàm tiện ích chuyển hex color sang rgb để dùng với rgba
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
      b.scale = 1 + 0.2 * Math.sin((120 - b.wrongTimer) / 5) // Hiệu ứng phóng to – thu nhỏ
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

function animate() {
  ctx.clearRect(0, 0, width, height)
  updateBubbles()
  updateParticles()
  bubbles.forEach(drawBubble)
  drawParticles()

  // Vẽ chữ cái cần chọn hiện tại ở nền canvas
  ctx.save()
  ctx.font = `${Math.min(width, height) * 0.25}px sans-serif`
  ctx.fillStyle = 'rgba(100, 100, 255, 0.1)' // xanh nhạt, mờ nhẹ
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(alphabet[currentIndex] || '', width / 2, height / 2)
  ctx.restore()

  requestAnimationFrame(animate)
}
function getThreeBubblesForCurrent() {
  const correctLetter = alphabet[currentIndex]
  const otherLetters = alphabet.filter((l, i) => i !== currentIndex)
  const wrongLetters = []

  while (wrongLetters.length < 2 && otherLetters.length > 0) {
    const idx = Math.floor(Math.random() * otherLetters.length)
    wrongLetters.push(otherLetters.splice(idx, 1)[0])
  }

  const letters = [correctLetter, ...wrongLetters]
  const shuffled = letters.sort(() => Math.random() - 0.5)
  return shuffled.map(createBubble)
}

function nextRound() {
  if (currentIndex >= alphabet.length) {
    gameOver.value = true
    return
  }

  bubbles = getThreeBubblesForCurrent()

  // Chỉ phát âm nếu đã có hành động người dùng
  if (userInteracted) {
    const instructionSound = new Howl({ src: ['/sounds/vietnamese/words/be-hay-bam-vao-chu.mp3'], volume: 1.5 })
    instructionSound.play()

    setTimeout(() => {
      const letter = alphabet[currentIndex]
      const filename = letterToFilename(letter)
      const letterSound = new Howl({ src: [`/sounds/vietnamese/alphabet/${filename}.mp3`], volume: 1.5 })
      letterSound.play()
    }, 1500)
  }
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
    const isMobile = window.innerWidth < 768
    const hitRadius = b.radius * (isMobile ? 1.3 : 1.0)
    if (!b.isPopped && dist < hitRadius) {
      if (b.letter === alphabet[currentIndex]) {
        b.isPopped = true
        createParticles(b.x, b.y, b.color)
        correctSound.play()
        currentIndex++
        setTimeout(nextRound, 400) // delay nhẹ để nhìn thấy hiệu ứng
      }
      else {
        wrongSound.play()
        b.isWrong = true
        b.wrongTimer = 120
        const angle = Math.random() * Math.PI * 2
        b.dx = Math.cos(angle) * 5
        b.dy = Math.sin(angle) * 5
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
  canvasHeight.value = window.innerHeight - 75
  width = window.innerWidth
  height = canvasHeight.value

  if (canvas.value) {
    canvas.value.width = width
    canvas.value.height = height
    ctx = canvas.value.getContext('2d')!
  }

  // Đặt lại vị trí các quả bong bóng nếu cần
  bubbles.forEach((b) => {
    b.x = Math.min(Math.max(b.x, b.radius), width - b.radius)
    b.y = Math.min(Math.max(b.y, b.radius), height - b.radius)
  })
}

onMounted(() => {
  alphabet = props?.data?.split('') || []
  ctx = canvas.value!.getContext('2d')!
  resize()
  window.addEventListener('click', handleClick)
  window.addEventListener('resize', resize)

  // Bắt đầu game sau tương tác đầu tiên
  const waitForInteraction = () => {
    if (!userInteracted) {
      userInteracted = true
      window.removeEventListener('click', waitForInteraction)
      window.removeEventListener('touchstart', waitForInteraction)
      restartGame() // chỉ khởi động game khi người dùng nhấn
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
