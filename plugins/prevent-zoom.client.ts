// plugins/prevent-zoom.client.ts
export default defineNuxtPlugin(() => {
  // Chặn zoom bằng cử chỉ (gesture)
  document.addEventListener('gesturestart', (e) => {
    e.preventDefault()
  })

  // Chặn zoom bằng touch move (trong trường hợp đặc biệt)
  document.addEventListener('touchmove', (e) => {
    // Ép kiểu để tránh lỗi TypeScript
    const touchEvent = e as TouchEvent & { scale?: number }
    if (touchEvent.scale !== undefined && touchEvent.scale !== 1) {
      e.preventDefault()
    }
  }, { passive: false })
})
