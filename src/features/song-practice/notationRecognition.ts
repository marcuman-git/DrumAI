import type { ChartBar, ChartInstrument } from './songChartLogic'
export interface StaffCandidate { top: number; gap: number }
export interface NoteCandidate { id: number; x: number; y: number; instrument: ChartInstrument; sourceLabel?: string; shape: 'oval' | 'cross'; strength: number; stemHint: boolean; flagHint: boolean }
export interface RecognitionImage { width: number; height: number; ink: Uint8Array; angle: number; staffs: StaffCandidate[] }
export interface RecognitionDraft { bar: ChartBar; source: string; page: number }
const candidateCache = new WeakMap<RecognitionImage, Map<string, NoteCandidate[]>>()
function rowBands(rows: number[], width: number, ratio = 0.28) {
  const bands: number[] = []
  for (let y = 0; y < rows.length; y++) {
    if (rows[y] < width * ratio) continue
    let weighted = 0; let weight = 0
    while (y < rows.length && rows[y] >= width * ratio) { weighted += y * rows[y]; weight += rows[y]; y++ }
    bands.push(weighted / weight)
  }
  return bands
}
function detectedStaffs(rows: number[], width: number) {
  const normal = staffGroups(rowBands(rows, width))
  // Dense note/beaming rows can interrupt the five-line sequence in a tight crop.
  return normal.length ? normal : staffGroups(rowBands(rows, width, 0.6))
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
  if (!Number.isInteger(width) || !Number.isInteger(height) || width < 20 || height < 20 || width * height > 810000 || data.length !== width * height * 4) throw new Error('Unsupported crop dimensions.')
  const xs: number[] = []; const ys: number[] = []
  // Reuse coordinates across skew trials rather than repeatedly dividing pixel indices.
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) { const i = (y * width + x) * 4; if (data[i + 3] > 128 && (data[i] + data[i + 1] + data[i + 2]) / 3 < threshold) { xs.push(x); ys.push(y) } }
  let angle = manualAngle ?? 0; let best = -1
  const angles = manualAngle === null ? Array.from({ length: 13 }, (_, index) => (index - 6) / 2) : [manualAngle]
  for (const candidate of angles) {
    const slope = Math.tan(candidate * Math.PI / 180); const rows = Array<number>(height).fill(0)
    for (let i = 0; i < xs.length; i++) { const y = Math.round(ys[i] - slope * (xs[i] - width / 2)); if (y >= 0 && y < height) rows[y]++ }
    const groups = detectedStaffs(rows, width)
    const score = groups.length * width * width + rows.reduce((sum, value) => sum + value * value, 0)
    if (score > best) { best = score; angle = candidate }
  }
  const ink = new Uint8Array(width * height); const slope = Math.tan(angle * Math.PI / 180); const rows = Array<number>(height).fill(0)
  for (let i = 0; i < xs.length; i++) { const x = xs[i]; const y = Math.round(ys[i] - slope * (x - width / 2)); if (y >= 0 && y < height) { ink[y * width + x] = 1; rows[y]++ } }
  return { width, height, ink, angle, staffs: detectedStaffs(rows, width) }
}
export function findNoteCandidates(image: RecognitionImage, staff: StaffCandidate): NoteCandidate[] {
  if (!Number.isFinite(staff.top) || !Number.isFinite(staff.gap) || staff.gap < 4 || staff.gap > 80) throw new Error('Invalid staff geometry.')
  const key = `${staff.top}:${staff.gap}`; const cache = candidateCache.get(image)
  const existing = cache?.get(key)
  if (existing) return existing.map((note) => ({ ...note }))
  const { width, height, ink } = image; const notes: NoteCandidate[] = []
  const at = (x: number, y: number) => x >= 0 && x < width && y >= 0 && y < height ? ink[Math.round(y) * width + Math.round(x)] ?? 0 : 0
  const halfX = Math.max(2, Math.round(staff.gap * 0.48)); const halfY = Math.max(2, Math.round(staff.gap * 0.3))
  const oval: [number, number][] = []; const cross: [number, number][] = []
  let ovalArea = 0
  for (let dy = -halfY; dy <= halfY; dy++) { let radius = 0; for (let dx = 0; dx <= halfX; dx++) if ((dx / halfX) ** 2 + (dy / halfY) ** 2 <= 1) radius = dx; oval.push([dy, radius]); ovalArea += radius * 2 + 1 }
  for (let dx = -halfX; dx <= halfX; dx++) for (const sign of [-1, 1]) cross.push([dx, Math.round(sign * dx / halfX * halfY)])
  const rowSums = new Map<number, Uint32Array>()
  function rowPrefix(y: number) {
    if (y < 0 || y >= height) return null
    let sums = rowSums.get(y)
    if (!sums) { sums = new Uint32Array(width + 1); for (let x = 0; x < width; x++) sums[x + 1] = sums[x] + ink[y * width + x]; rowSums.set(y, sums) }
    return sums
  }
  // Cymbal positions vary by publisher; retain their position for manual identification.
  const levels: [ChartInstrument, number][] = [['Hi-hat', -2], ['Hi-hat', -1.5], ['Hi-hat', -1], ['Hi-hat', -0.5], ['Hi-hat', 0], ...Array.from({ length: 11 }, (_, index): [ChartInstrument, number] => { const offset = (index + 1) / 2; return [offset === 3.5 || offset >= 4.5 ? 'Kick' : 'Snare', offset] })]
  for (const [instrument, offset] of levels) {
    const y = Math.round(staff.top + offset * staff.gap)
    const peaks: { x: number; score: number }[] = []
    for (let x = halfX; x < width - halfX; x++) {
      // Cross heads do not need the unrelated oval-density calculation.
      let dark = 0
      if (instrument === 'Hi-hat') { for (const [dx, dy] of cross) dark += Math.max(at(x + dx, y + dy - 1), at(x + dx, y + dy), at(x + dx, y + dy + 1)) }
      else { for (const [dy, radius] of oval) { const sums = rowPrefix(y + dy); if (sums) dark += sums[x + radius + 1] - sums[x - radius] } }
      const score = dark / (instrument === 'Hi-hat' ? cross.length : ovalArea)
      if (score >= (instrument === 'Hi-hat' ? 0.78 : 0.58)) peaks.push({ x, score })
    }
    for (const peak of peaks.sort((a, b) => b.score - a.score)) {
      if (notes.some((note) => note.instrument === instrument && Math.abs(note.y - y) < staff.gap * 0.4 && Math.abs(note.x - peak.x) < staff.gap * 1.1)) continue
      let stem = 0; for (let dy = 4; dy < staff.gap * 3; dy++) stem += at(peak.x + halfX, y - dy)
      let flags = 0; for (let dx = 3; dx < staff.gap; dx++) flags += at(peak.x + halfX + dx, y - staff.gap * 2)
      notes.push({ id: notes.length, x: peak.x, y, instrument, sourceLabel: instrument === 'Hi-hat' ? `Cymbal/Hi-hat candidate (staff offset ${offset})` : `${instrument} suggestion (staff offset ${offset}; verify instrument)`, shape: instrument === 'Hi-hat' ? 'cross' : 'oval', strength: peak.score, stemHint: stem > staff.gap, flagHint: flags > 2 })
    }
  }
  // Reject weaker shoulders of the same oval head at neighboring half-space levels.
  // Equally strong adjacent heads remain available for simultaneous voices.
  const result = notes.filter((note) => note.shape !== 'oval' || !notes.some((other) => other.shape === 'oval' && other.strength > note.strength + 0.12 && Math.abs(other.x - note.x) <= staff.gap * 0.65 && Math.abs(other.y - note.y) <= staff.gap * 0.6)).sort((a, b) => a.x - b.x)
  const entries = cache ?? new Map<string, NoteCandidate[]>()
  if (entries.size >= 8) entries.delete(entries.keys().next().value!)
  entries.set(key, result); candidateCache.set(image, entries)
  return result.map((note) => ({ ...note }))
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
  const bar = { 'Hi-hat': Array(16).fill(0), Snare: Array(16).fill(0), Kick: Array(16).fill(0), Crash: Array(16).fill(0), Ride: Array(16).fill(0) }
  for (const note of notes) { const raw = (note.x - first) / (last - first) * 15; const step = Math.round(raw); if (step >= 0 && step < 16 && Math.abs(raw - step) <= 0.4) bar[note.instrument][step] = 2 }
  return bar
}
