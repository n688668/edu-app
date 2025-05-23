<script setup lang="ts">
useHead({
  title: 'Trò chơi Ghép Vần',
})

const vowels = [
  'a',
  'á',
  'à',
  'ả',
  'ã',
  'ạ',
  'ă',
  'ắ',
  'ằ',
  'ẳ',
  'ẵ',
  'ặ',
  'â',
  'ấ',
  'ầ',
  'ẩ',
  'ẫ',
  'ậ',
  'e',
  'é',
  'è',
  'ẻ',
  'ẽ',
  'ẹ',
  'ê',
  'ế',
  'ề',
  'ể',
  'ễ',
  'ệ',
  'i',
  'í',
  'ì',
  'ỉ',
  'ĩ',
  'ị',
  'o',
  'ó',
  'ò',
  'ỏ',
  'õ',
  'ọ',
  'ô',
  'ố',
  'ồ',
  'ổ',
  'ỗ',
  'ộ',
  'ơ',
  'ớ',
  'ờ',
  'ở',
  'ỡ',
  'ợ',
  'u',
  'ú',
  'ù',
  'ủ',
  'ũ',
  'ụ',
  'ư',
  'ứ',
  'ừ',
  'ử',
  'ữ',
  'ự',
  'y',
  'ý',
  'ỳ',
  'ỷ',
  'ỹ',
  'ỵ',
]

const consonants = [
  'b',
  'c',
  'd',
  'đ',
  'g',
  'h',
  'k',
  'l',
  'm',
  'n',
  'p',
  'q',
  'r',
  's',
  't',
  'v',
  'x',
  'ch',
  'gh',
  'ng',
  'ngh',
  'nh',
  'ph',
  'th',
  'tr',
  'gi',
  'kh',
  'qu',
]

const selectedFirst = ref('')
const selectedSecond = ref('')

const syllable = computed(() => {
  if (selectedFirst.value && selectedSecond.value) {
    return selectedFirst.value + selectedSecond.value
  }
  return ''
})

function selectLetter(letter: string) {
  if (!selectedFirst.value) {
    selectedFirst.value = letter
  }
  else if (!selectedSecond.value) {
    selectedSecond.value = letter
  }
  else {
    // Reset nếu đã chọn đủ 2 chữ
    selectedFirst.value = letter
    selectedSecond.value = ''
  }
}

function isSelected(letter: string) {
  return selectedFirst.value === letter || selectedSecond.value === letter
}
</script>

<template>
  <div class="min-h-screen bg-pink-100 p-4">
    <h1 class="text-3xl font-bold text-center text-pink-600 mb-4">
      🧩 Trò chơi Ghép Vần
    </h1>

    <div class="text-center text-lg mb-4">
      Bé hãy chọn 2 chữ cái bất kỳ để ghép vần nhé!
    </div>

    <div class="flex flex-col items-center gap-6">
      <!-- Nguyên âm -->
      <div class="w-full max-w-4xl">
        <h2 class="text-xl font-semibold text-pink-700 mb-2">
          Nguyên âm
        </h2>

        <div class="flex flex-wrap gap-2 mb-4">
          <button
            v-for="v in vowels"
            :key="`QURpZ${v}`"
            class="w-20 h-20 rounded-full text-3xl font-bold shadow flex items-center justify-center transition-all duration-200" :class="[
              isSelected(v)
                ? 'bg-yellow-300 scale-110 ring-4 ring-yellow-500'
                : 'bg-white border-2 border-pink-300 hover:bg-pink-200 active:scale-110 text-pink-600',
            ]"
            @click="selectLetter(v)"
          >
            {{ v }}
          </button>
        </div>
      </div>

      <!-- Phụ âm -->
      <div class="w-full max-w-4xl">
        <h2 class="text-xl font-semibold text-blue-700 mb-2">
          Phụ âm
        </h2>

        <div class="flex flex-wrap gap-2 mb-4">
          <button
            v-for="c in consonants"
            :key="`zqCSB${c}`"
            class="w-20 h-20 rounded-full text-3xl font-bold shadow flex items-center justify-center transition-all duration-200" :class="[
              isSelected(c)
                ? 'bg-yellow-300 scale-110 ring-4 ring-yellow-500'
                : 'bg-white border-2 border-blue-300 hover:bg-blue-200 active:scale-110 text-blue-600',
            ]"
            @click="selectLetter(c)"
          >
            {{ c }}
          </button>
        </div>
      </div>

      <!-- Kết quả cố định dưới màn hình -->
      <div
        v-if="syllable"
        class="fixed bottom-0 left-0 right-0 mb-4 mx-auto w-full max-w-md bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-4 text-center z-50"
      >
        <div class="text-xl text-green-700 font-bold mb-1">
          🎉 Bé đã ghép được:
        </div>
        <div class="text-5xl text-red-500 font-bold">
          {{ syllable }}
        </div>
        <div class="flex justify-center gap-4 mt-4">
          <button
            class="bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-full px-6 py-2 text-lg font-semibold shadow"
            @click="selectedFirst = ''; selectedSecond = ''"
          >
            🔄 Chọn lại
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
button:focus {
  outline: none;
}
</style>
