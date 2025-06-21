<script setup lang="ts">
import * as PIXI from 'pixi.js'
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

const container = ref<HTMLDivElement | null>(null)

interface Particle {
  gfx: PIXI.Graphics
  x: number
  y: number
  originX: number
  originY: number
  vx: number
  vy: number
  size: number
  color: number
  phase: number
}

let app: PIXI.Application
const particles: Particle[] = []
const mouse = { x: -9999, y: -9999, radius: 100 }

const shapes = [
  { name: 'heart', label: '❤️ Trái tim' },
  { name: 'star', label: '⭐ Ngôi sao' },
  { name: 'circle', label: '⚪ Tròn' },
  { name: 'square', label: '◼️ Vuông' },
  { name: 'rect', label: '▭ Chữ nhật' },
  { name: 'flower', label: '🌸 Hoa' },
  { name: 'moon', label: '🌙 Trăng' },
  { name: 'diamond', label: '🔷 Thoi' },
]

onMounted(() => {
  app = new PIXI.Application({
    resizeTo: window,
    backgroundColor: 0xFFE6F0,
    antialias: true,
  })

  nextTick(() => {
    if (app.view && container.value) {
      container.value.appendChild(app.view)
    }
  })

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX
    mouse.y = e.clientY
  })
  window.addEventListener('mouseleave', () => {
    mouse.x = -9999
    mouse.y = -9999
  })
  window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      mouse.x = e.touches[0].clientX
      mouse.y = e.touches[0].clientY
    }
  }, { passive: true })
  window.addEventListener('touchend', () => {
    mouse.x = -9999
    mouse.y = -9999
  })

  generateParticles() // khởi tạo ban đầu
  setShape('heart') // gán hình gốc
  app.ticker.add(() => animate())
})

onBeforeUnmount(() => {
  app.destroy(true)
})

function generateParticles() {
  const width = window.innerWidth
  const height = window.innerHeight
  const centerX = width / 2
  const centerY = height / 2
  const colors = [0xFF1A75, 0xFF4D4D, 0xFF6666, 0xFF9999, 0xFF0033]

  const count = 1000
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2
    const distance = Math.random() * Math.max(width, height)
    const startX = centerX + Math.cos(angle) * distance
    const startY = centerY + Math.sin(angle) * distance
    const color = colors[Math.floor(Math.random() * colors.length)]
    const size = 2 + Math.random()
    const phase = Math.random() * Math.PI * 2

    const gfx = new PIXI.Graphics()
    gfx.beginFill(color, 1)
    gfx.drawCircle(0, 0, size)
    gfx.endFill()
    gfx.x = startX
    gfx.y = startY
    app.stage.addChild(gfx)

    particles.push({
      gfx,
      x: startX,
      y: startY,
      originX: centerX,
      originY: centerY,
      vx: 0,
      vy: 0,
      size,
      color,
      phase,
    })
  }
}

function setShape(shapeName: string) {
  const width = window.innerWidth
  const height = window.innerHeight
  const centerX = width / 2
  const centerY = height / 2
  const scale = Math.min(width, height) / 40
  const step = 0.03
  let points: { x: number, y: number }[] = []

  for (let x = -1.5; x <= 1.5; x += step) {
    for (let y = -1.5; y <= 1.5; y += step) {
      let isInside = false
      switch (shapeName) {
        case 'heart': {
          const f = (x ** 2 + y ** 2 - 1) ** 3 - x ** 2 * y ** 3
          isInside = f <= 0
          break
        }
        case 'circle':
          isInside = x * x + y * y <= 1
          break
        case 'square':
          isInside = Math.abs(x) <= 1 && Math.abs(y) <= 1
          break
        case 'rect':
          isInside = Math.abs(x) <= 1.2 && Math.abs(y) <= 0.6
          break
        case 'star': {
          const R1 = 1 // bán kính đỉnh sao
          const R2 = 0.5 // bán kính lõm giữa cánh
          const angle = Math.atan2(y, x)
          const r = Math.sqrt(x * x + y * y)
          const spikes = 5
          const theta = angle * spikes
          const radius = (Math.cos(theta) > 0) ? R1 : R2
          isInside = r <= radius
          break
        }
        case 'flower': {
          const petal = Math.sin(5 * Math.atan2(y, x)) * Math.sqrt(x * x + y * y)
          isInside = petal < 0.6 && petal > -0.6
          break
        }
        case 'moon':
          isInside = x * x + y * y < 1 && (x + 0.4) * (x + 0.4) + y * y > 0.6
          break
        case 'diamond':
          isInside = Math.abs(x) + Math.abs(y) <= 1
          break
      }

      if (isInside) {
        points.push({ x: x * 16, y: y * 13 })
      }
    }
  }

  // Shuffle points
  points = points.sort(() => Math.random() - 0.5)

  // Thêm bớt particles tương ứng
  const needed = points.length
  const current = particles.length

  if (needed > current) {
    const extra = needed - current
    for (let i = 0; i < extra; i++) {
      const angle = Math.random() * Math.PI * 2
      const dist = Math.random() * Math.max(width, height)
      const startX = centerX + Math.cos(angle) * dist
      const startY = centerY + Math.sin(angle) * dist
      const color = 0xFF4D4D
      const size = 2 + Math.random()
      const phase = Math.random() * Math.PI * 2

      const gfx = new PIXI.Graphics()
      gfx.beginFill(color)
      gfx.drawCircle(0, 0, size)
      gfx.endFill()
      gfx.x = startX
      gfx.y = startY
      app.stage.addChild(gfx)

      particles.push({
        gfx,
        x: startX,
        y: startY,
        originX: centerX,
        originY: centerY,
        vx: 0,
        vy: 0,
        size,
        color,
        phase,
      })
    }
  }
  else if (needed < current) {
    const toRemove = particles.splice(needed, current - needed)
    for (const p of toRemove) {
      app.stage.removeChild(p.gfx)
    }
  }

  // Gán vị trí mới
  for (let i = 0; i < needed; i++) {
    const pt = points[i]
    particles[i].originX = centerX + pt.x * scale
    particles[i].originY = centerY - pt.y * scale
  }
}

function animate() {
  const time = performance.now()
  for (const p of particles) {
    const offset = Math.sin(time * 0.004 + p.phase) * 4
    const dx = mouse.x - p.x
    const dy = mouse.y - p.y
    const dist2 = dx * dx + dy * dy
    const r2 = mouse.radius * mouse.radius

    if (dist2 < r2) {
      const dist = Math.sqrt(dist2)
      const angle = Math.atan2(dy, dx)
      const force = (mouse.radius - dist) / mouse.radius
      const fx = Math.cos(angle) * force * 3
      const fy = Math.sin(angle) * force * 3
      p.vx -= fx
      p.vy -= fy
    }

    const toX = p.originX - p.x + offset
    const toY = p.originY - p.y + offset
    p.vx += toX * 0.005
    p.vy += toY * 0.015
    p.vx *= 0.82
    p.vy *= 0.92
    p.x += p.vx
    p.y += p.vy

    p.gfx.x = p.x
    p.gfx.y = p.y
    p.gfx.alpha = 1 - Math.abs(offset) / 6
  }
}
</script>

<template>
  <div class="w-screen h-screen overflow-hidden" style="background-color: #ffe6f0;">
    <div ref="container" class="w-full h-full bg-[#ffe6f0]" />
    <div class="fixed bottom-4 left-4 z-10 flex flex-wrap gap-2 p-2 bg-white bg-opacity-70 rounded-xl shadow">
      <button
        v-for="shape in shapes"
        :key="shape.name"
        class="bg-pink-300 px-3 py-1 rounded hover:bg-pink-400 text-base font-semibold"
        @click="() => setShape(shape.name)"
      >
        {{ shape.label }}
      </button>
    </div>
  </div>
</template>

<style scoped>
html,
body {
  margin: 0;
  padding: 0;
  overflow: hidden;
}
</style>
