<script setup lang="ts">
useHead({
  title: 'Kỹ Năng Sống Cho Bé',
})

const isLoading = ref(true)
const selectedSkill: any = ref(null)

const prompt = `
Hãy tạo một mảng JSON gồm 20 kỹ năng sống cần thiết cho trẻ 3-6 tuổi. Mỗi phần tử có dạng:
{
  "name": "Tên kỹ năng",
  "emoji": "Biểu tượng minh họa (emoji)",
  "description": "Giải thích ngắn gọn, dễ hiểu cho bé"
}
Chủ đề nên bao gồm: lễ nghĩa trong gia đình, ứng xử với người ngoài, kỹ năng ở trường lớp, sinh hoạt cá nhân (đánh răng, rửa tay, dọn đồ chơi...), và tình huống xã hội đơn giản. Trả về đúng mảng JSON.
`

const { data: skills, fetchWords } = useGeminiWords(prompt)

async function fetchData() {
  isLoading.value = true
  try {
    await fetchWords()
  }
  catch {
    // fallback nếu lỗi
  }
  finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchData()
})

function closeModal() {
  selectedSkill.value = null
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-orange-100 via-pink-100 to-yellow-100 p-6 relative">
    <LoadingScreen v-if="isLoading" />

    <div v-else>
      <h1 class="text-3xl font-bold text-pink-700 mb-8 text-center select-none">
        🌟 Kỹ Năng Sống Cho Bé
      </h1>

      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 justify-items-center mb-6">
        <div
          v-for="(skill, index) in skills"
          :key="`skill-${index}`"
          class="bg-white p-6 rounded-3xl shadow-lg cursor-pointer flex flex-col items-center justify-center w-36 h-36 active:scale-110 transform transition-all duration-300"
          @click="selectedSkill = skill"
        >
          <div class="text-6xl mb-2 select-none">
            {{ skill.emoji }}
          </div>
          <div class="text-lg font-semibold text-pink-900 text-center select-none">
            {{ skill.name }}
          </div>
        </div>
      </div>

      <div class="flex justify-center mb-6">
        <button
          class="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-4 px-8 text-2xl rounded-full shadow-lg active:scale-105 transition-transform"
          @click="fetchData"
        >
          🔁 Tải các từ khác
        </button>
      </div>

      <!-- Modal hiển thị chi tiết -->
      <div v-if="selectedSkill" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="closeModal">
        <div class="bg-white rounded-3xl p-8 max-w-md mx-auto text-center shadow-xl">
          <div class="text-7xl mb-4 select-none">
            {{ selectedSkill.emoji }}
          </div>
          <h2 class="text-3xl font-bold text-pink-800 mb-4 select-none">
            {{ selectedSkill.name }}
          </h2>
          <p class="text-xl text-gray-700 mb-6 select-none">
            {{ selectedSkill.description }}
          </p>
          <button
            class="bg-pink-500 text-white px-6 py-3 rounded-xl text-2xl font-bold shadow hover:bg-pink-600 active:scale-95 transition"
            @click="selectedSkill = null"
          >
            Đóng lại
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
