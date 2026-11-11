/** Fully labelled controlled head fixture; not representative of all PDF engraving. */
export function syntheticRecognitionBar(scale = 1, skew = 0) {
  const width = 400 * scale; const height = 160 * scale
  const pixels = new Uint8ClampedArray(width * height * 4).fill(255)
  const slope = Math.tan(skew * Math.PI / 180)
  const black = (x: number, y: number) => {
    const column = Math.round(x); const row = Math.round(y + slope * (x - width / 2))
    if (column < 0 || row < 0 || column >= width || row >= height) return
    const index = (row * width + column) * 4
    pixels[index] = pixels[index + 1] = pixels[index + 2] = 0
  }
  for (let line = 0; line < 5; line++) for (let x = 20 * scale; x < 380 * scale; x++) black(x, (40 + line * 12) * scale)
  const heads = [{ x: 100 * scale, y: 58 * scale, instrument: 'Snare' }, { x: 220 * scale, y: 94 * scale, instrument: 'Kick' }, { x: 280 * scale, y: 70 * scale, instrument: 'Floor tom 1' }]
  for (const head of heads) for (let dx = -6 * scale; dx <= 6 * scale; dx++) for (let dy = -4 * scale; dy <= 4 * scale; dy++) if ((dx / (6 * scale)) ** 2 + (dy / (4 * scale)) ** 2 <= 1) black(head.x + dx, head.y + dy)
  for (let dx = -6 * scale; dx <= 6 * scale; dx++) for (const sign of [-1, 1]) black(160 * scale + dx, 34 * scale + sign * dx * 0.6)
  return { pixels, width, height, heads: [...heads, { x: 160 * scale, y: 34 * scale, instrument: 'Hi-hat' }] }
}
