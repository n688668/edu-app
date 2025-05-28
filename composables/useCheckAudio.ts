export function useCheckAudio() {
  const checkAudio = async (path: string): Promise<boolean> => {
    try {
      const res = await fetch(path, { method: 'HEAD' })
      return res.ok
    }
    catch (err) {
      console.warn('⚠️ Không thể kiểm tra file:', path, err)
      return false
    }
  }

  return {
    checkAudio,
  }
}
