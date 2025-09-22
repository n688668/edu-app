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

let ctx: CanvasRenderingContext2D
let width: number, height: number
let bubbles: any[] = []
let particles: any[] = []
let alphabet: string[] = []
let currentIndex = 0
const colors = ['#ff6b6b', '#6bcBef', '#ffe66d', '#48dbfb', '#1dd1a1', '#f368e0']
// cá mập đã max size → đổi màu
const colorPalette = ['#ff6b6b', '#6bcBef', '#ffe66d', '#48dbfb', '#1dd1a1', '#f368e0', '#ff922b']

// Cá mập
// SVG string (gradient xanh dương → xanh đậm)
const sharkSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
  <defs>
    <linearGradient id="sharkGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#00008b"/>   <!-- xanh dương nhạt -->
      <stop offset="100%" stop-color="#00bfff"/> <!-- xanh đậm -->
    </linearGradient>
  </defs>
  <path fill="url(#sharkGradient)" d="M15.56 9.09C14.66 7.18 12.54 6 11 6c.47 1.4.28 2.57-.05 3.43C8.45 10 6 11 6 11S3 7 1 7l2 6l-1 4c2 0 4-3 4-3s5 2 8 2v2c.65 0 1.91-.83 2.73-2.23c1.24-.21 2.27-.56 3.14-.96c-.15-.18-.34-.37-.59-.51c-.65-.39-1.46-.63-2.28-.8c.82-.16 1.67-.28 2.59-.15c.46.06.95.19 1.41.51c.1.06.17.14.24.19C22.4 13.26 23 12.44 23 12c0-.87-3.81-2.5-7.44-2.91M18 12c-.55 0-1-.45-1-1c0-.24.1-.45.23-.62c.61.12 1.2.29 1.74.46c.03.05.03.1.03.16c0 .55-.45 1-1 1"/>
</svg>
`

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

const sharkSize = ref(80) // kích thước hiện tại
const sharkMinSize = 80 // min size
const sharkMaxSize = 200 // max size
const sharkGrowStep = 20 // mỗi lần ăn tăng bao nhiêu
const sharkShrinkSpeed = 0.01 // tốc độ co khi bắt đầu round mới
let sharkBounce = 0 // hiệu ứng bập bùng (scale)
const sharkBounceStep = 0.15 // mức phóng đại tạm thời khi ăn (15%)
let sharkBounceTime = 0 // thời gian hiệu ứng bập bùng
const sharkBounceDuration = 20 // số frame bập bùng

function createBubble(letter: string) {
  // giảm base và variation
  const radiusBase = alphabet.length <= 10 ? 50 : window.innerWidth < 768 ? 40 : 50
  const radiusVariation = alphabet.length <= 10 ? 20 : window.innerWidth < 768 ? 10 : 20
  const radius = radiusBase + Math.random() * radiusVariation

  const dyFast = 5 + Math.random() * 3 // tốc độ bắn xuống nhanh

  return {
    letter,
    x: Math.random() * width,
    y: -radius - Math.random() * 50,
    radius,
    baseRadius: radiusBase,
    scale: 1,
    color: colors[Math.floor(Math.random() * colors.length)],
    dx: (Math.random() - 0.5) * 2,
    dy: dyFast,
    initialDy: dyFast, // lưu tốc độ khởi tạo
    normalSpeed: 0.5 + Math.random() * 1.5,
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

    // Chọn tỉ lệ slowdown dựa trên orientation
    const slowdownRatio = width > height ? 1 / 10 : 1 / 20
    const slowdownHeight = height * slowdownRatio

    if (b.y > slowdownHeight && b.dy > b.normalSpeed) {
      const factor = 0.75 // giảm tốc dần
      b.dy *= factor
      if (b.dy < b.normalSpeed)
        b.dy = b.normalSpeed
    }

    // Đảo chiều ngang nếu chạm trái/phải
    if (b.x - b.radius < 0 || b.x + b.radius > width)
      b.dx *= -1

    // Khi bóng ra khỏi đáy màn hình
    if (b.y - b.radius > height) {
      createParticles(b.x, height - b.radius, b.color)
      b.isPopped = true
      if (b.letter === alphabet[currentIndex]) {
        currentIndex++
        nextRound()
      }
    }

    // Hiệu ứng bóng sai
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

  // Loại bỏ những quả bóng đã “popped”
  bubbles = bubbles.filter(b => !b.isPopped)
}

function updateParticles() {
  particles = particles.filter(p => p.life > 0)
  particles.forEach((p) => {
    p.x += p.dx
    p.y += p.dy
    p.life--
  })
}

// helper: adjust brightness
function adjustColor(hex: string, percent: number) {
  const num = Number.parseInt(hex.replace('#', ''), 16)
  let r = (num >> 16) & 255
  let g = (num >> 8) & 255
  let b = num & 255

  r = Math.min(255, Math.max(0, r + (r * percent)))
  g = Math.min(255, Math.max(0, g + (g * percent)))
  b = Math.min(255, Math.max(0, b + (b * percent)))

  return `rgb(${r},${g},${b})`
}

function updateSharkColor() {
  // chọn 1 màu base từ palette
  const base = colorPalette[Math.floor(Math.random() * colorPalette.length)]

  // tạo 2 màu nhạt / đậm hơn
  const lighter = adjustColor(base, 0.3) // sáng hơn 30%
  const darker = adjustColor(base, -0.3) // tối hơn 30%

  const newSvg = sharkSvg
    .replace(/<stop offset="0%" stop-color=".*?"\/>/, `<stop offset="0%" stop-color="${darker}"/>`)
    .replace(/<stop offset="100%" stop-color=".*?"\/>/, `<stop offset="100%" stop-color="${lighter}"/>`)

  sharkImg = new Image()
  sharkImg.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(newSvg)}`
}

// 🚩 Update cá mập
let sharkWanderTimer = 0
let sharkWaveTime = 0

function updateShark() {
  if (shark.target && !shark.target.isPopped) {
    // bơi theo target (giữ nguyên)
    const dx = shark.target.x - shark.x
    const dy = shark.target.y - shark.y
    const dist = Math.hypot(dx, dy)

    if (dist < shark.target.radius) {
      shark.target.isPopped = true
      createParticles(shark.target.x, shark.target.y, shark.target.color)
      correctSound?.play()
      currentIndex++

      // tăng kích thước nếu chưa đạt max, nếu đã max thì đổi màu
      if (sharkSize.value < sharkMaxSize - 10) {
        sharkSize.value = Math.min(sharkSize.value + sharkGrowStep, sharkMaxSize)
      }
      else {
        updateSharkColor()
      }

      // bật hiệu ứng bập bùng
      sharkBounceTime = 0

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
    // bơi tự do
    if (sharkWanderTimer <= 0) {
      const angle = Math.random() * Math.PI * 2
      shark.dx = Math.cos(angle) * (1 + Math.random() * 0.5)
      shark.dy = Math.sin(angle) * (1 + Math.random() * 0.5)
      sharkWanderTimer = 120 + Math.random() * 120
    }
    sharkWanderTimer--

    shark.x += shark.dx
    shark.y += shark.dy

    // lượn sóng nhẹ
    sharkWaveTime += 0.05
    const baseAngle = Math.atan2(shark.dy, shark.dx)
    const waveOffset = Math.sin(sharkWaveTime) * 0.2
    shark.angle = baseAngle + waveOffset

    // 🚩 Xử lý khi cá mập kẹt cạnh/góc
    const margin = 50
    let stuck = false
    if (shark.x < margin)
      stuck = true
    if (shark.x > width - margin)
      stuck = true
    if (shark.y < margin)
      stuck = true
    if (shark.y > height - margin)
      stuck = true

    if (stuck) {
      // Tính vector về trung tâm
      const dx = width / 2 - shark.x
      const dy = height / 2 - shark.y
      const dist = Math.hypot(dx, dy)

      // Reset dx/dy để thoát kẹt
      shark.dx = (dx / dist) * shark.speed
      shark.dy = (dy / dist) * shark.speed

      // Dịch vị trí một chút về trung tâm ngay lập tức để không còn dính biên
      shark.x += shark.dx
      shark.y += shark.dy
    }

    // Giữ biên màn hình
    if (shark.x < 0)
      shark.x = 0
    if (shark.x > width)
      shark.x = width
    if (shark.y < 0)
      shark.y = 0
    if (shark.y > height)
      shark.y = height
  }

  if (sharkBounceTime < sharkBounceDuration) {
    sharkBounceTime++
    const t = sharkBounceTime / sharkBounceDuration
    sharkBounce = Math.sin(t * Math.PI) * sharkBounceStep
  }
}

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

  const finalSize = sharkSize.value * (1 + sharkBounce)
  ctx.drawImage(sharkImg, -finalSize / 2, -finalSize / 2, finalSize, finalSize)

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

  // Vị trí cố định: trái – giữa – phải
  const positionsX = [width * 0.2, width * 0.5, width * 0.8]

  // Lấy 3 màu khác nhau từ colors
  const shuffledColors = shuffleArray(colors).slice(0, 3)

  return shuffled.map((letter, i) => {
    const bubble = createBubble(letter)
    bubble.x = positionsX[i] + (Math.random() - 0.5) * 30 // lệch ±30px
    bubble.color = shuffledColors[i] // gán màu khác nhau
    return bubble
  })
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

  // giảm kích thước dần về minSize
  const shrinkInterval = setInterval(() => {
    if (sharkSize.value > sharkMinSize) {
      sharkSize.value = Math.max(sharkSize.value - sharkShrinkSpeed, sharkMinSize)
    }
    else {
      clearInterval(shrinkInterval)
    }
  }, 16)

  bubbles = getThreeBubblesForCurrent()

  const instructionSound = new Howl({ src: ['/sounds/vietnamese/words/be-hay-bam-vao-chu.mp3'], volume: 1.5 })
  instructionSound.play()

  setTimeout(() => {
    const letter = alphabet[currentIndex]
    const filename = letterToFilename(letter)

    const folder = /\d/.test(letter) ? 'numbers' : 'alphabet'

    const letterSound = new Howl({
      src: [`/sounds/vietnamese/${folder}/${filename}.mp3`],
      volume: 1.5,
    })
    letterSound.play()
  }, 1500)
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

  // load shark từ SVG string
  sharkImg = new Image()
  sharkImg.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(sharkSvg)}`

  shark.x = width / 2
  shark.y = height / 2

  // Tự động bắt đầu game sau 0.5s
  setTimeout(restartGame, 500)

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
    <canvas ref="canvas" class="absolute top-0 left-0 w-full h-full z-10" />

    <!-- nền san hô -->
    <div class="absolute bottom-0 left-0 w-full z-0 pointer-events-none">
      <img
        src="/coral.png"
        alt="coral"
        class="w-full h-auto object-cover opacity-40"
      >
    </div>

    <SuccessMessage
      v-if="gameOver"
      message="Bé đã hoàn thành rồi!"
      class="absolute inset-0 flex flex-col items-center justify-center z-20"
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
