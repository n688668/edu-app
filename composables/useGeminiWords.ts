import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI('AIzaSyDDtWPtKzO6x8e8vkpEKLaN4bgaj3-N6SQ')

export function useGeminiWords(prompt: string) {
  const data = ref<any[]>([])

  async function fetchWords() {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
      const result = await model.generateContent(prompt)
      const response = await result.response
      const text = response.text()

      // Loại bỏ các dòng markdown ``` nếu có
      const cleaned = text
        .split('\n')
        .filter(line => !line.trim().startsWith('```'))
        .join('\n')

      data.value = JSON.parse(cleaned)
    }
    catch (error) {
      console.error('Gemini error:', error)
    }
  }

  return {
    data,
    fetchWords,
  }
}
