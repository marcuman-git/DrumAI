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
it('finds cross candidates above conventional hi-hat position', () => {
  const source = fixture()
  for (let dx = -6; dx <= 6; dx++) for (const sign of [-1, 1]) {
    const index = (Math.round(22 + sign * dx * 0.6) * source.width + 280 + dx) * 4
    source.data[index] = source.data[index + 1] = source.data[index + 2] = 0
  }
  const image = analyzeStaffs(source.data, source.width, source.height)
  expect(findNoteCandidates(image, image.staffs[0]).some((note) => Math.abs(note.x - 280) < 4 && note.sourceLabel?.includes('Cymbal'))).toBe(true)
})
it('rejects noninteger crop sizes and invalid manual staff spacing', () => {
  expect(() => analyzeStaffs(new Uint8ClampedArray(40000), 100.5, 100)).toThrow()
  expect(() => findNoteCandidates({ width: 100, height: 100, ink: new Uint8Array(10000), angle: 0, staffs: [] }, { top: 30, gap: Infinity })).toThrow()
})
it('searches additional staff spaces and below the bottom staff line', () => {
  const width = 240; const height = 150; const ink = new Uint8Array(width * height)
  for (const [cx, cy] of [[70, 70], [170, 94]]) for (let dx = -6; dx <= 6; dx++) for (let dy = -4; dy <= 4; dy++) if ((dx/6)**2 + (dy/4)**2 <= 1) ink[(cy+dy)*width+cx+dx] = 1
  const notes = findNoteCandidates({ width, height, ink, angle: 0, staffs: [] }, { top: 40, gap: 12 })
  expect(notes.some((note) => Math.abs(note.x-70) <= 3 && note.y === 70)).toBe(true)
  expect(notes.some((note) => note.instrument === 'Kick' && Math.abs(note.x-170) <= 3 && note.y === 94)).toBe(true)
})
it('reuses candidates without sharing mutable acceptance or instrument mappings', () => {
  const source = fixture(); const image = analyzeStaffs(source.data, source.width, source.height)
  const first = findNoteCandidates(image, image.staffs[0]); const original = first[0].instrument
  first[0].instrument = 'Ride'
  expect(findNoteCandidates(image, image.staffs[0])[0].instrument).toBe(original)
  expect(findNoteCandidates(image, { ...image.staffs[0], gap: 10 })).not.toEqual(first)
})
it('maps supplied-key tom positions separately without changing the generic profile', () => {
  const width=260; const height=150; const ink=new Uint8Array(width*height)
  for(const [x,y] of [[60,46],[170,76]]) for(let dx=-6;dx<=6;dx++)for(let dy=-4;dy<=4;dy++)if((dx/6)**2+(dy/4)**2<=1) ink[(y+dy)*width+x+dx]=1
  const image={width,height,ink,angle:0,staffs:[]}; const staff={top:40,gap:12}
  const generic=findNoteCandidates(image,staff)
  const key=findNoteCandidates(image,staff,'master-key')
  expect(key.some((note)=>note.instrument==='Tom 1' && Math.abs(note.x-60)<4)).toBe(true)
  expect(key.some((note)=>note.instrument==='Floor tom 2' && Math.abs(note.x-170)<4)).toBe(true)
  expect(generic.some((note)=>note.instrument==='Tom 1')).toBe(false)
})
it('detects both floor-tom key positions on controlled heads', () => {
  const width = 260; const height = 150; const ink = new Uint8Array(width * height)
  for (const [x, y] of [[70, 70], [180, 76]]) for (let dx = -6; dx <= 6; dx++) for (let dy = -4; dy <= 4; dy++) if ((dx / 6) ** 2 + (dy / 4) ** 2 <= 1) ink[(y + dy) * width + x + dx] = 1
  const notes = findNoteCandidates({ width, height, ink, angle: 0, staffs: [] }, { top: 40, gap: 12 }, 'master-key')
  expect(notes.some((note) => note.instrument === 'Floor tom 1' && Math.abs(note.x - 70) < 4)).toBe(true)
  expect(notes.some((note) => note.instrument === 'Floor tom 2' && Math.abs(note.x - 180) < 4)).toBe(true)
})
it('maps the floor-tom space from both supplied beginner guides', () => {
  const width = 260; const height = 150; const ink = new Uint8Array(width * height)
  for (let dx = -6; dx <= 6; dx++) for (let dy = -4; dy <= 4; dy++) if ((dx / 6) ** 2 + (dy / 4) ** 2 <= 1) ink[(70 + dy) * width + 120 + dx] = 1
  const notes = findNoteCandidates({ width, height, ink, angle: 0, staffs: [] }, { top: 40, gap: 12 }, 'guide-kit')
  expect(notes.some((note) => note.instrument === 'Floor tom 1' && Math.abs(note.x - 120) < 4)).toBe(true)
})
it('calibrates narrow displaced floor-tom heads without retaining cached generic mappings', () => {
  const width = 220; const height = 140; const ink = new Uint8Array(width * height)
  for (let dx = -3; dx <= 3; dx++) for (let dy = -2; dy <= 2; dy++) if ((dx / 3) ** 2 + (dy / 2) ** 2 <= 1) ink[(72 + dy) * width + 100 + dx] = 1
  const image = { width, height, ink, angle: 0, staffs: [] }; const staff = { top: 40, gap: 12 }
  const original = findNoteCandidates(image, staff)
  const calibrated = findNoteCandidates(image, staff, 'generic', { floorTom1: 2.5, floorTom2: 3, tolerance: 2, headScale: 0.6 })
  expect(calibrated.some((note) => note.instrument === 'Floor tom 1' && Math.abs(note.x - 100) < 4)).toBe(true)
  expect(findNoteCandidates(image, staff)).toEqual(original)
  expect(() => findNoteCandidates(image, staff, 'generic', { tolerance: 20 })).toThrow()
  expect(() => findNoteCandidates(image, staff, 'generic', { headScale: 0.1 })).toThrow()
})
it('separates several internal barlines from one thick boundary', async () => {
  const { interiorBarlines } = await import('./notationRecognition')
  const width = 260; const height = 140; const ink = new Uint8Array(width * height)
  for (const start of [65, 150]) for (let x = start; x < start + 5; x++) for (let y = 40; y <= 84; y++) ink[y * width + x] = 1
  const image = { width, height, ink, angle: 0, staffs: [] }; const staff = { top: 40, gap: 11 }
  expect(interiorBarlines(image, staff, 20, 240)).toHaveLength(2)
  expect(interiorBarlines(image, staff, 20, 110)).toHaveLength(1)
})
