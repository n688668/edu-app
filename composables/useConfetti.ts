import confetti from 'canvas-confetti'

export function useConfetti() {
  function shootAtCursor(event: MouseEvent) {
    const x = event.clientX / window.innerWidth
    const y = event.clientY / window.innerHeight
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { x, y },
    })
  }

  function shootCenter() {
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { x: 0.5, y: 0.5 },
    })
  }

  function launchConfetti() {
    const duration = 3 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 160, zIndex: 9999 }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        clearInterval(interval)
        return
      }

      const particleCount = 150 * (timeLeft / duration)
      // since particles fall down, start them at random x positions
      confetti({
        ...defaults,
        particleCount,
        origin: {
          x: Math.random(),
          y: Math.random() * 0.6,
        },
      })
    }, 250)
  }

  return {
    shootAtCursor,
    shootCenter,
    launchConfetti,
  }
}
