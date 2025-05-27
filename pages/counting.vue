<script setup lang="ts">
useHead({
  title: 'Đếm Số Từ 1 đến 100',
})

// Danh sách số
const numbers: any = ref([])
const clickedNumbers = ref(new Set())
const correctNumbers = ref(new Set())
const wrongNumbers = ref(new Set())
const currentExpected = ref(1)

function shuffle(array) {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

const countNumbers = 100
const isCompleted = ref(false)

function resetGame() {
  correctNumbers.value.clear()
  wrongNumbers.value.clear()
  clickedNumbers.value.clear()
  currentExpected.value = 1
  numbers.value = shuffle(Array.from({ length: countNumbers }, (_, i) => i + 1))
  isCompleted.value = false
}

async function playSound(event: MouseEvent, number: any) {
  if (correctNumbers.value.has(number) || isCompleted.value)
    return

  if (number === currentExpected.value) {
    correctNumbers.value.add(number)
    wrongNumbers.value.delete(number)
    clickedNumbers.value.add(number)
    currentExpected.value++
    if (correctNumbers.value.size === countNumbers) {
      isCompleted.value = true
    }
  }
  else {
    if (!wrongNumbers.value.has(number)) {
      wrongNumbers.value.add(number)
      setTimeout(() => {
        wrongNumbers.value.delete(number)
      }, 2000)
    }
  }

  const { shootAtCursor } = useConfetti()
  const { playFallback } = useFallbackSound()
  const { tryPlay } = usePlayLocalIfExists()

  // Bắn pháo bông
  shootAtCursor(event)

  if (await tryPlay(`/sounds/vietnamese/numbers/${number}.mp3`))
    return

  // Nếu thất bại, fallback
  playFallback()
}

onMounted(() => {
  numbers.value = shuffle(Array.from({ length: countNumbers }, (_, i) => i + 1))
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100 p-6">
    <h1 class="text-4xl font-bold text-purple-700 mb-8 text-center select-none">
      🔢 Đếm Số Từ 1 đến {{ countNumbers }}
    </h1>

    <SuccessMessage v-if="isCompleted" message="Bé đã đếm đúng hết số rồi!" @click="resetGame" />

    <div v-else class="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-6">
      <button
        v-for="n in numbers"
        :key="`$KtaIN${n}`"
        class="w-20 h-20 sm:w-24 sm:h-24 rounded-full shadow-md font-bold flex items-center justify-center select-none text-5xl transition-all duration-300 ease-in-out active:scale-150" :class="[
          correctNumbers.has(n)
            ? 'bg-green-400 text-white scale-110'
            : wrongNumbers.has(n)
              ? 'bg-red-400 text-white scale-110'
              : 'bg-white text-pink-600 hover:scale-105',
        ]"
        @click="(e) => playSound(e, n)"
      >
        {{ n }}
      </button>
    </div>
  </div>
</template>
