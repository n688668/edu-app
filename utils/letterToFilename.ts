export default function (letter: string): string {
  // Hàm chuyển ký tự tiếng Việt có dấu sang tên file không dấu
  const map: Record<string, string> = {
    ă: 'aw',
    â: 'aa',
    ê: 'ee',
    ô: 'oo',
    ơ: 'ow',
    ư: 'uw',
    đ: 'dd',
  }

  const base = letter.toLowerCase()
  return map[letter] || base
}
