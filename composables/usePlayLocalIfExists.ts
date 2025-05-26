import { Howl } from 'howler'
import { useCheckLocalAudio } from './useCheckLocalAudio'

export function usePlayLocalIfExists() {
  const { checkLocalAudio } = useCheckLocalAudio()

  /**
   * Thử phát âm thanh từ đường dẫn local, nếu tồn tại.
   * @param src đường dẫn tới file mp3 (ví dụ: /sounds/abc.mp3)
   * @returns true nếu đã phát, false nếu không tồn tại hoặc lỗi.
   */
  const tryPlay = async (src: string): Promise<boolean> => {
    if (await checkLocalAudio(src)) {
      try {
        const sound = new Howl({ src: [src], volume: 1.0 })
        sound.play()
        return true
      }
      catch (e) {
        console.warn('⚠️ Lỗi phát file local:', src, e)
        return false
      }
    }
    return false
  }

  return {
    tryPlay,
  }
}
