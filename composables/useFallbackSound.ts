import { Howl } from 'howler'

export function useFallbackSound() {
  const playFallback = () => {
    const sound = new Howl({
      src: ['/sounds/sharp-pop.mp3'],
      volume: 1.0,
    })
    sound.play()
  }

  return {
    playFallback,
  }
}
