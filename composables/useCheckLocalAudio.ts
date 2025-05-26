export function useCheckLocalAudio() {
  const checkLocalAudio = async (path: string): Promise<boolean> => {
    try {
      const res = await fetch(path, { method: 'HEAD' })
      return res.ok
    }
    catch (err) {
      console.warn('⚠️ Không thể kiểm tra file local:', path, err)
      return false
    }
  }

  return {
    checkLocalAudio,
  }
}
