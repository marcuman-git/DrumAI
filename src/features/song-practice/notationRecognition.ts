import type { ChartBar, ChartInstrument } from './songChartLogic'
export interface StaffCandidate { top: number; gap: number }
export interface NoteCandidate { id: number; x: number; y: number; instrument: ChartInstrument; shape: 'oval' | 'cross'; strength: number; stemHint: boolean; flagHint: boolean }
export interface RecognitionImage { width: number; height: number; ink: Uint8Array; angle: number; staffs: StaffCandidate[] }
export interface RecognitionDraft { bar: ChartBar; source: string; page: number }
function rowBands(rows: number[], width: number) {
  const bands: number[] = []
  for (let y = 0; y < rows.length; y++) {
    if (rows[y] < width * 0.28) continue
    let weighted = 0; let weight = 0
    while (y < rows.length && rows[y] >= width * 0.28) { weighted += y * rows[y]; weight += rows[y]; y++ }
    bands.push(weighted / weight)
  }
  return bands
}
function staffGroups(lines: number[]): StaffCandidate[] {
  const staffs: StaffCandidate[] = []
  for (let i = 0; i <= lines.length - 5; i++) {
    const gaps = Array.from({ length: 4 }, (_, j) => lines[i + j + 1] - lines[i + j])
    const gap = gaps.reduce((sum, value) => sum + value, 0) / 4
    if (gap >= 4 && gap <= 80 && gaps.every((value) => Math.abs(value - gap) <= Math.max(1.5, gap * 0.18))) { staffs.push({ top: lines[i], gap }); i += 4 }
  }
  return staffs
}
export function analyzeStaffs(data: Uint8ClampedArray, width: number, height: number, threshold = 160, manualAngle: number | null = null): RecognitionImage {
  if (!Number.isFinite(threshold) || threshold < 40 || threshold > 230 || (manualAngle !== null && (!Number.isFinite(manualAngle) || Math.abs(manualAngle) > 5))) throw new Error('Invalid detection controls.')
  if (width < 20 || height < 20 || width * height > 810000 || data.length !== width * height * 4) throw new Error('Unsupported crop dimensions.')
  const pixels: number[] = []
  for (let i = 0; i < width * height; i++) if (data[i * 4 + 3] > 128 && (data[i * 4] + data[i * 4 + 1] + data[i * 4 + 2]) / 3 < threshold) pixels.push(i)
  let angle = manualAngle ?? 0; let best = -1
  const angles = manualAngle === null ? Array.from({ length: 13 }, (_, index) => (index - 6) / 2) : [manualAngle]
  for (const candidate of angles) {
    const slope = Math.tan(candidate * Math.PI / 180); const rows = Array<number>(height).fill(0)
    for (const pixel of pixels) { const y = Math.round(Math.floor(pixel / width) - slope * (pixel % width - width / 2)); if (y >= 0 && y < height) rows[y]++ }
    const groups = staffGroups(rowBands(rows, width))
    const score = groups.length * width * width + rows.reduce((sum, value) => sum + value * value, 0)
    if (score > best) { best = score; angle = candidate }
  }
  const ink = new Uint8Array(width * height); const slope = Math.tan(angle * Math.PI / 180); const rows = Array<number>(height).fill(0)
  for (const pixel of pixels) { const x = pixel % width; const y = Math.round(Math.floor(pixel / width) - slope * (x - width / 2)); if (y >= 0 && y < height) { ink[y * width + x] = 1; rows[y]++ } }
  return { width, height, ink, angle, staffs: staffGroups(rowBands(rows, width)) }
}
export function findNoteCandidates(image: RecognitionImage, staff: StaffCandidate): NoteCandidate[] {
  const { width, height, ink } = image; const notes: NoteCandidate[] = []
  const at = (x: number, y: number) => x >= 0 && x < width && y >= 0 && y < height ? ink[Math.round(y) * width + Math.round(x)] ?? 0 : 0
  const halfX = Math.max(2, Math.round(staff.gap * 0.48)); const halfY = Math.max(2, Math.round(staff.gap * 0.3))
  const levels: [ChartInstrument, number][] = [['Hi-hat', -0.5], ['Snare', 1.5], ['Kick', 3.5]]
  for (const [instrument, offset] of levels) {
    const y = Math.round(staff.top + offset * staff.gap)
    const peaks: { x: number; score: number }[] = []
    for (let x = halfX; x < width - halfX; x++) {
      let dark = 0; let total = 0
      for (let dy = -halfY; dy <= halfY; dy++) for (let dx = -halfX; dx <= halfX; dx++) {
        if ((dx / halfX) ** 2 + (dy / halfY) ** 2 <= 1) { dark += at(x + dx, y + dy); total++ }
      }
      let crossDark = 0; let crossTotal = 0
      if (instrument === 'Hi-hat') for (let dx = -halfX; dx <= halfX; dx++) for (const sign of [-1, 1]) { const dy = Math.round(sign * dx / halfX * halfY); crossDark += Math.max(at(x + dx, y + dy - 1), at(x + dx, y + dy), at(x + dx, y + dy + 1)); crossTotal++ }
      const score = instrument === 'Hi-hat' ? crossDark / Math.max(1, crossTotal) : dark / Math.max(1, total)
      if (score >= (instrument === 'Hi-hat' ? 0.78 : 0.58)) peaks.push({ x, score })
    }
    for (const peak of peaks.sort((a, b) => b.score - a.score)) {
      if (notes.some((note) => note.instrument === instrument && Math.abs(note.x - peak.x) < staff.gap * 1.1)) continue
      let stem = 0; for (let dy = 4; dy < staff.gap * 3; dy++) stem += at(peak.x + halfX, y - dy)
      let flags = 0; for (let dx = 3; dx < staff.gap; dx++) flags += at(peak.x + halfX + dx, y - staff.gap * 2)
      notes.push({ id: notes.length, x: peak.x, y, instrument, shape: instrument === 'Hi-hat' ? 'cross' : 'oval', strength: peak.score, stemHint: stem > staff.gap, flagHint: flags > 2 })
    }
  }
  return notes.sort((a, b) => a.x - b.x)
}
export function findBarlineHints(image: RecognitionImage, staff: StaffCandidate): number[] {
  const hints: number[] = []
  for (let x = 0; x < image.width; x++) {
    let ink = 0; for (let y = Math.round(staff.top); y <= Math.round(staff.top + staff.gap * 4); y++) ink += image.ink[y * image.width + x] ?? 0
    if (ink > staff.gap * 3.6 && (!hints.length || x - hints[hints.length - 1] > 3)) hints.push(x)
  }
  return hints
}
export function candidatesToBar(notes: NoteCandidate[], first: number, last: number): ChartBar {
  if (!Number.isFinite(first) || !Number.isFinite(last) || last <= first) throw new Error('Invalid slot centers.')
  const bar: ChartBar = { 'Hi-hat': Array(16).fill(0), Snare: Array(16).fill(0), Kick: Array(16).fill(0) }
  for (const note of notes) { const raw = (note.x - first) / (last - first) * 15; const step = Math.round(raw); if (step >= 0 && step < 16 && Math.abs(raw - step) <= 0.4) bar[note.instrument][step] = 2 }
  return bar
}
