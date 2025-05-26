export async function useFptTTS(text: string): Promise<string | null> {
  try {
    const res: any = await $fetch('https://tts-api-edu.onrender.com/tts', {
      method: 'POST',
      body: { text },
    })

    const proxyUrl = `https://tts-api-edu.onrender.com/proxy-audio?url=${encodeURIComponent(res.asyncUrl)}`
    return proxyUrl
  }
  catch (err) {
    console.error('❌ useFptTTS error:', err)
    return null
  }
}
