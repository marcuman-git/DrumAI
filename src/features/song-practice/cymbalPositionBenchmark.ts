/** Controlled cymbal engraving cases; labels describe this fixture's drum key only. */
export function cymbalPositionFixture(scale = 1, skew = 0, hatOffset = -0.5) {
 const width = 320 * scale; const height = 150 * scale; const top = 40 * scale; const gap = 12 * scale
 const pixels = new Uint8ClampedArray(width * height * 4).fill(255)
 const black = (x: number, y: number) => {
  const column = Math.round(x); const row = Math.round(y + Math.tan(skew * Math.PI / 180) * (x - width / 2))
  if (column < 0 || column >= width || row < 0 || row >= height) return
  const index = (row * width + column) * 4; pixels[index] = pixels[index + 1] = pixels[index + 2] = 0
 }
 for (let line = 0; line < 5; line++) for (let x = 10 * scale; x < 310 * scale; x++) black(x, top + line * gap)
 const heads = [{ instrument: 'Crash', x: 60 * scale, y: top - gap }, { instrument: 'Hi-hat', x: 120 * scale, y: top + gap * hatOffset }, { instrument: 'Ride', x: 190 * scale, y: top }, { instrument: 'Pedal hi-hat', x: 260 * scale, y: top + gap * 4.5 }]
 for (const head of heads) for (let dx = -6 * scale; dx <= 6 * scale; dx++) for (const sign of [-1, 1]) black(head.x + dx, head.y + sign * dx * 0.6)
 return { pixels, width, height, heads }
}
