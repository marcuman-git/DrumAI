import { describe, expect, it } from 'vitest'
import { analyzeStaffs, candidatesToBar, findNoteCandidates } from './notationRecognition'
function fixture(scale = 1, skew = 0) {
  const width = 400 * scale; const height = 150 * scale; const data = new Uint8ClampedArray(width * height * 4).fill(255)
  const black = (x: number, y: number) => { x = Math.round(x); y = Math.round(y); if (x < 0 || x >= width || y < 0 || y >= height) return; const index = (y * width + x) * 4; data[index] = data[index + 1] = data[index + 2] = 0 }
  for (let line = 0; line < 5; line++) for (let x = 20 * scale; x < 380 * scale; x++) black(x, (40 + line * 12) * scale + Math.tan(skew * Math.PI / 180) * (x - width / 2))
  for (const [cx, cy] of [[100, 58], [220, 82]]) for (let dx = -6 * scale; dx <= 6 * scale; dx++) for (let dy = -4 * scale; dy <= 4 * scale; dy++) if ((dx / (6 * scale)) ** 2 + (dy / (4 * scale)) ** 2 <= 1) black(cx * scale + dx, cy * scale + dy)
  for (let dx = -6 * scale; dx <= 6 * scale; dx++) { black(160 * scale + dx, 34 * scale + dx * 0.6); black(160 * scale + dx, 34 * scale - dx * 0.6) }
  return { data, width, height }
}
describe('experimental notation heuristics', () => {
  it('detects five-line staff and regular/cross candidates on a clean synthetic fixture', () => {
    const source = fixture(); const image = analyzeStaffs(source.data, source.width, source.height)
    expect(image.staffs).toHaveLength(1); expect(image.staffs[0].gap).toBeCloseTo(12)
    const notes = findNoteCandidates(image, image.staffs[0])
    expect(notes.some((note) => note.instrument === 'Snare' && Math.abs(note.x - 100) < 4)).toBe(true)
    expect(notes.some((note) => note.instrument === 'Hi-hat' && Math.abs(note.x - 160) < 4)).toBe(true)
    expect(notes.some((note) => note.instrument === 'Kick' && Math.abs(note.x - 220) < 4)).toBe(true)
  })
  it('supports scaled staff lines and modest skew', () => {
    const scaled = fixture(2)
    expect(analyzeStaffs(scaled.data, scaled.width, scaled.height).staffs[0].gap).toBeCloseTo(24)
    const skewed = fixture(1, 2)
    const image = analyzeStaffs(skewed.data, skewed.width, skewed.height)
    expect(image.staffs.length).toBeGreaterThan(0); expect(Math.abs(image.angle - 2)).toBeLessThanOrEqual(0.5)
  })
  it('does not invent notes in blank images and rejects invalid slot centers', () => {
    expect(analyzeStaffs(new Uint8ClampedArray(100 * 100 * 4).fill(255), 100, 100).staffs).toHaveLength(0)
    expect(() => candidatesToBar([], 10, 10)).toThrow()
    expect(candidatesToBar([], 0, 100).Snare.every((value) => value === 0)).toBe(true)
  })
})
it('detects multiple independent staffs in a stacked synthetic crop', () => {
  const source = fixture(); const height = source.height * 2
  const data = new Uint8ClampedArray(source.width * height * 4).fill(255)
  data.set(source.data, 0); data.set(source.data, source.data.length)
  expect(analyzeStaffs(data, source.width, height).staffs).toHaveLength(2)
})
