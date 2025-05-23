<script setup lang="ts">
import confetti from 'canvas-confetti'

useHead({
  title: 'Game Chọn Thẻ',
})

const baseEmojis = useEmoji()

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

const cards: any = ref([])
const selected: any = ref([])
const matchedIds = ref(new Set())
const showCongrats = ref(false)
const revealedIds = ref(new Set())

function resetGame() {
  const selectedEmojis = shuffle([...baseEmojis]).slice(0, 6)
  const emojiPairs = shuffle([...selectedEmojis, ...selectedEmojis].map((emoji, index) => ({
    id: `${index}-${Math.random()}`,
    emoji,
  })))
  cards.value = emojiPairs
  selected.value = []
  matchedIds.value = new Set()
  revealedIds.value = new Set()
  showCongrats.value = false
}

function selectCard(card) {
  if (
    selected.value.length < 2
    && !matchedIds.value.has(card.id)
    && !selected.value.find(c => c.id === card.id)
  ) {
    revealedIds.value.add(card.id)
    selected.value.push(card)
    if (selected.value.length === 2) {
      const [a, b] = selected.value
      if (a.emoji === b.emoji) {
        confetti()
        matchedIds.value.add(a.id)
        matchedIds.value.add(b.id)
        selected.value = []

        if (matchedIds.value.size === cards.value.length) {
          showCongrats.value = true
        }
      }
      else {
        setTimeout(() => {
          revealedIds.value.delete(a.id)
          revealedIds.value.delete(b.id)
          selected.value = []
        }, 800)
      }
    }
  }
}

function isSelected(card) {
  return selected.value.find(c => c.id === card.id)
}
function isRevealed(card) {
  return revealedIds.value.has(card.id) || matchedIds.value.has(card.id)
}

onMounted(() => {
  resetGame()
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100 p-6">
    <h1 class="text-4xl font-bold text-purple-700 mb-8 text-center select-none">
      🃏 Chọn Thẻ
    </h1>

    <SuccessMessage v-if="showCongrats" @click="resetGame" />

    <div v-else class="grid grid-cols-3 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
      <button
        v-for="card in cards"
        :key="card.id"
        class="text-5xl h-24 w-full flex items-center justify-center rounded-2xl shadow-md bg-white transition-all duration-300 select-none border-4"
        :disabled="matchedIds.has(card.id)"
        :class="{
          'border-gray-300': !isSelected(card),
          'border-red-500 !bg-red-100': isSelected(card),
          'invisible': matchedIds.has(card.id),
        }"
        @click="selectCard(card)"
      >
        <span v-if="isRevealed(card)">{{ card.emoji }}</span>
        <span v-else>❓</span>
      </button>
    </div>
  </div>
</template>
