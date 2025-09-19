<script setup lang="ts">
useHead({
  title: 'Tô màu',
})

const svgList = [
  '/svg/suv-svgrepo-com.svg',
  '/svg/airplane-svgrepo-com.svg',
  '/svg/airport-svgrepo-com.svg',
  '/svg/big-truck-svgrepo-com.svg',
  '/svg/bike-svgrepo-com.svg',
  '/svg/boat-svgrepo-com.svg',
  '/svg/bus-svgrepo-com.svg',
  '/svg/car-svgrepo-com.svg',
  '/svg/fire-truck-svgrepo-com.svg',
  '/svg/helicopter-svgrepo-com.svg',
  '/svg/high-speed-rail-svgrepo-com.svg',
  '/svg/hot-air-balloon-svgrepo-com.svg',
  '/svg/minibus-svgrepo-com.svg',
  '/svg/motorcycle-svgrepo-com.svg',
  '/svg/plane-svgrepo-com.svg',
  '/svg/police-car-svgrepo-com.svg',
  '/svg/railway-svgrepo-com.svg',
  '/svg/rocket-svgrepo-com.svg',
  '/svg/sailboat-svgrepo-com.svg',
  '/svg/school-bus-svgrepo-com.svg',
  '/svg/scooter-scooter-svgrepo-com.svg',
  '/svg/ship-cruise-svgrepo-com.svg',
  '/svg/small-train-svgrepo-com.svg',
  '/svg/small-truck-svgrepo-com.svg',
  '/svg/taxi-svgrepo-com.svg',
  '/svg/the-bus-svgrepo-com.svg',
  '/svg/transportation-color-car-taxi-svgrepo-com.svg',
  '/svg/transportation-color-plane-18-svgrepo-com.svg',
  '/svg/truck-svgrepo-com.svg',
]

const currentSvg = ref<string | null>(null)
const colors = ref<string[]>([
  '#FF0000',
  '#FF7F00',
  '#FFFF00',
  '#00FF00',
  '#00FFFF',
  '#0000FF',
  '#8B00FF',
  '#FFC0CB',
  '#A52A2A',
  '#FFFFFF',
  '#000000',
])
const selectedColor = ref<string>('#FF0000')

async function loadSvg(path: string) {
  const res = await fetch(path)
  const text = await res.text()
  currentSvg.value = text
}

function onColorClick(color: string) {
  selectedColor.value = color
}

function onSvgClick(e: Event) {
  const target = e.target as HTMLElement
  if (target.tagName === 'path' || target.tagName === 'circle' || target.tagName === 'rect' || target.tagName === 'polygon') {
    target.setAttribute('fill', selectedColor.value)
  }
}

onMounted(() => {
  loadSvg(svgList[0])
})
</script>

<template>
  <div class="flex flex-col items-start p-4 pt-16 space-y-4 bg-gradient-to-b from-blue-100 to-blue-200 min-h-screen">
    <h1 class="text-xl font-bold text-center mb-4">
      🎨 Tô màu
    </h1>

    <!-- Bảng màu -->
    <div class="flex space-x-2 overflow-x-auto w-full px-2">
      <button
        v-for="(color, idx) in colors"
        :key="idx"
        class="flex-shrink-0 w-12 h-12 rounded-full border-4 border-white shadow-lg active:scale-90 transition"
        :style="{ backgroundColor: color }"
        @click="onColorClick(color)"
      />
    </div>

    <!-- Danh sách ảnh -->
    <div class="flex space-x-2 overflow-x-auto w-full px-2">
      <button
        v-for="(svg, idx) in svgList"
        :key="idx"
        class="bg-white p-2 rounded-xl shadow-md border-2 border-blue-400 flex-shrink-0 active:scale-95 transition"
        @click="loadSvg(svg)"
      >
        <img :src="svg" alt="icon" class="w-16 h-16 object-contain">
      </button>
    </div>

    <!-- SVG hiển thị -->
    <div
      v-if="currentSvg"
      class="bg-white rounded-xl shadow-lg p-2 w-full flex justify-center items-center"
      @click="onSvgClick"
      v-html="currentSvg"
    />
  </div>
</template>

<style scoped>
svg {
  width: 100%;
  height: auto;
  max-height: 70vh;
}
path, circle, rect, polygon {
  stroke: black;
  stroke-width: 2;
}
</style>
