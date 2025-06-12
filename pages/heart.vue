<script setup lang="ts">
const canvas = ref<HTMLCanvasElement | null>(null)

interface Particle {
  x: number
  y: number
  z: number
  originX: number
  originY: number
  originZ: number
  vx: number
  vy: number
  vz: number
  size: number
  color: string
  phase: number
}

const particles: Particle[] = []
const mouse = { x: -9999, y: -9999, radius: 100 }
const colors = ['#ff1a75', '#ff4d4d', '#ff6666', '#ff9999', '#ff0033']

onMounted(() => {
  const ctx = canvas.value!.getContext('2d')!
  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)

  canvas.value!.addEventListener('mousemove', (e) => {
    const rect = canvas.value!.getBoundingClientRect()
    mouse.x = e.clientX - rect.left
    mouse.y = e.clientY - rect.top
  })
  canvas.value!.addEventListener('mouseleave', () => {
    mouse.x = -9999
    mouse.y = -9999
  })

  // Touch support
  canvas.value!.addEventListener('touchmove', (e) => {
    const rect = canvas.value!.getBoundingClientRect()
    const touch = e.touches[0]
    mouse.x = touch.clientX - rect.left
    mouse.y = touch.clientY - rect.top
  }, { passive: true })

  canvas.value!.addEventListener('touchend', () => {
    mouse.x = -9999
    mouse.y = -9999
  })

  function resizeCanvas() {
    canvas.value!.width = window.innerWidth
    canvas.value!.height = window.innerHeight
    generateHeart()
  }

  function generateHeart() {
    particles.length = 0
    const scale = Math.min(canvas.value!.width, canvas.value!.height) / 40
    const centerX = canvas.value!.width / 2
    const centerY = canvas.value!.height / 2

    function isInsideHeart(x: number, y: number): boolean {
      const value = (x ** 2 + y ** 2 - 1) ** 3 - x ** 2 * y ** 3
      return value <= 0
    }

    const step = 0.025
    for (let x = -1.5; x <= 1.5; x += step) {
      for (let y = -1.5; y <= 1.5; y += step) {
        if (isInsideHeart(x, y)) {
          const px = x * 16
          const py = y * 13
          const z = Math.random() * 6 - 3
          const phase = Math.random() * Math.PI * 2
          const angle = Math.random() * Math.PI * 2
          const distance = Math.random() * Math.max(canvas.value!.width, canvas.value!.height)
          const startX = centerX + Math.cos(angle) * distance
          const startY = centerY + Math.sin(angle) * distance

          particles.push({
            x: startX,
            y: startY,
            z: 0,
            originX: centerX + px * scale,
            originY: centerY - py * scale,
            originZ: z,
            vx: 0,
            vy: 0,
            vz: 0,
            size: 2 + Math.random(),
            color: colors[Math.floor(Math.random() * colors.length)],
            phase,
          })
        }
      }
    }
  }

  function animate(time = 0) {
    requestAnimationFrame(animate)
    ctx.clearRect(0, 0, canvas.value!.width, canvas.value!.height)

    for (const p of particles) {
      const offset = Math.sin(time * 0.004 + p.phase) * 4
      const dx = mouse.x - p.x
      const dy = mouse.y - p.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < mouse.radius) {
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

      const depthAlpha = 1 - (Math.abs(p.originZ) / 5)
      ctx.beginPath()
      ctx.fillStyle = `${p.color}${Math.floor(depthAlpha * 255).toString(16).padStart(2, '0')}`
      ctx.arc(p.x, p.y, p.size * depthAlpha, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  animate()
})
</script>

<template>
  <div class="w-screen h-screen overflow-hidden" style="background-color: #ffe6f0;">
    <canvas ref="canvas" class="block w-full h-full" />
  </div>
</template>

<style scoped>
html,
body {
  margin: 0;
  padding: 0;
  background: #ffe6f0;
  overflow: hidden;
}
</style>
