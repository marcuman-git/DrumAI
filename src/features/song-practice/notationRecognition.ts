import { inspectHatMark } from './notationSymbols'
import type { ChartBar, ChartInstrument } from './songChartLogic'
import { completeBar } from './chartKit'
export type RecognitionProfile = 'generic' | 'master-key' | 'guide-kit'
export interface RecognitionOptions { kick?: number; snare?: number; floorTom1?: number; floorTom2?: number; tolerance?: number; headScale?: number; cleanHeads?: boolean }
export interface StaffCandidate { top: number; gap: number }
export interface NoteCandidate { id: number; x: number; y: number; instrument: ChartInstrument; sourceLabel?: string; shape: 'oval' | 'cross'; strength: number; stemHint: boolean; flagHint: boolean; articulationHint?: 'open' | 'half-open' }
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
export function findNoteCandidates(image: RecognitionImage, staff: StaffCandidate, profile: RecognitionProfile = 'generic', options: RecognitionOptions = {}): NoteCandidate[] {
  if (!Number.isFinite(staff.top) || !Number.isFinite(staff.gap) || staff.gap < 4 || staff.gap > 80) throw new Error('Invalid staff geometry.')
  const headScale = options.headScale ?? 1
  if (!Number.isFinite(headScale) || headScale < 0.6 || headScale > 1.4) throw new Error('Invalid notehead scale.')
  const tolerance = options.tolerance ?? 0
  if (!Number.isInteger(tolerance) || tolerance < 0 || tolerance > 4 || [options.floorTom1, options.floorTom2, options.kick, options.snare].some((offset) => offset !== undefined && (!Number.isFinite(offset) || offset < -1 || offset > 6))) throw new Error('Invalid recognition calibration.')
  const key = `${staff.top}:${staff.gap}:${profile}:${tolerance}:${options.floorTom1}:${options.floorTom2}:${options.kick}:${options.snare}:${headScale}:${!!options.cleanHeads}`; const cache = candidateCache.get(image)
  const existing = cache?.get(key)
  if (existing) return existing.map((note) => ({ ...note }))
  const { width, height, ink } = image; const notes: NoteCandidate[] = []
  const at = (x: number, y: number) => x >= 0 && x < width && y >= 0 && y < height ? ink[Math.round(y) * width + Math.round(x)] ?? 0 : 0
  const halfX = Math.max(2, Math.round(staff.gap * 0.48 * headScale)); const halfY = Math.max(2, Math.round(staff.gap * 0.3 * headScale))
  const oval: [number, number][] = []; const cross: [number, number][] = []
  let ovalArea = 0
  for (let dy = -halfY; dy <= halfY; dy++) { let radius = 0; for (let dx = 0; dx <= halfX; dx++) if ((dx / halfX) ** 2 + (dy / halfY) ** 2 <= 1) radius = dx; oval.push([dy, radius]); ovalArea += radius * 2 + 1 }
  for (let dx = -halfX; dx <= halfX; dx++) for (const sign of [-1, 1]) cross.push([dx, Math.round(sign * dx / halfX * halfY)])
  const staffLines = Array.from({ length: 5 }, (_, index) => staff.top + index * staff.gap)
  const rowSums = new Map<number, Uint32Array>()
  function rowPrefix(y: number) {
    if (y < 0 || y >= height) return null
    let sums = rowSums.get(y)
    if (!sums) { sums = new Uint32Array(width + 1); for (let x = 0; x < width; x++) sums[x + 1] = sums[x] + ink[y * width + x]; rowSums.set(y, sums) }
    return sums
  }
  // Cymbal positions vary by publisher; retain their position for manual identification.
  const levels: [ChartInstrument, number][] = profile === 'guide-kit'
    ? [['Crash', -1], ['Hi-hat', -0.5], ['Ride', 0], ['Tom 1', 0.5], ['Tom 2', 1], ['Snare', 1.5], ['Floor tom 1', 2.5], ['Kick', 3.5], ['Pedal hi-hat', 4.5]]
    : profile === 'master-key'
    ? [['Crash', -2], ['Crash', -1.5], ['Crash', -1], ['Hi-hat', -0.5], ['Ride', 0], ['Pedal hi-hat', 4.5], ['Tom 1', 0.5], ['Tom 2', 1], ['Snare', 1.5], ['Tom 3', 2], ['Floor tom 1', 2.5], ['Floor tom 2', 3], ['Kick', 3.5], ['Kick 2', 4]]
    : [['Hi-hat', -2], ['Hi-hat', -1.5], ['Hi-hat', -1], ['Hi-hat', -0.5], ['Hi-hat', 0], ...Array.from({ length: 11 }, (_, index): [ChartInstrument, number] => { const offset = (index + 1) / 2; return [offset === 3.5 || offset >= 4.5 ? 'Kick' : 'Snare', offset] })]
  const overrides: [ChartInstrument, number | undefined][] = [['Floor tom 1', options.floorTom1], ['Floor tom 2', options.floorTom2], ['Kick', options.kick], ['Snare', options.snare]]
  const calibrated = levels.filter(([instrument, offset]) => !overrides.some(([name, value]) => value !== undefined && (instrument === name || (!['Hi-hat', 'Crash', 'Ride', 'Pedal hi-hat'].includes(instrument) && offset === value))))
  for (const [name, offset] of overrides) if (offset !== undefined) calibrated.push([name, offset])
  for (const [instrument, offset] of calibrated) {
    const crossHead = ['Hi-hat', 'Crash', 'Ride', 'Pedal hi-hat'].includes(instrument)
    const y = Math.round(staff.top + offset * staff.gap)
    const peaks: { x: number; score: number; y: number }[] = []
    for (let x = halfX; x < width - halfX; x++) {
      let bestScore = -1; let bestY = y
      for (let shift = -tolerance; shift <= tolerance; shift++) {
        const centerY = y + shift; let dark = 0; let area = ovalArea; let usefulRows = 0
        if (crossHead) { for (const [dx, dy] of cross) dark += Math.max(at(x + dx, centerY + dy - 1), at(x + dx, centerY + dy), at(x + dx, centerY + dy + 1)) }
        else { for (const [dy, radius] of oval) { const rowY = centerY + dy; const sums = rowPrefix(rowY)
          if (options.cleanHeads && sums) {
            const line = staffLines.some((line) => Math.abs(line - rowY) <= 1)
            let extended = 0; let total = 0
            for (let dx = halfX + 3; dx <= halfX + 8; dx++) { extended += at(x - dx, rowY) + at(x + dx, rowY); total += 2 }
            if (line || extended / total > 0.35) { area -= radius * 2 + 1; continue }
          }
          if (sums) { dark += sums[x + radius + 1] - sums[x - radius]; usefulRows++ }
        } }
        let score = dark / (crossHead ? cross.length : area)
        if (options.cleanHeads && !crossHead && (usefulRows < 3 || area < ovalArea * 0.3)) score = 0
        if (options.cleanHeads && crossHead) { let core = 0; for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) core += at(x + dx, centerY + dy); if (core >= 8) score = 0 }
        if (options.cleanHeads && !crossHead && score > 0) {
          let mass = 0; let moment = 0
          for (let dy = -halfY * 2; dy <= halfY * 2; dy++) {
            const rowY = centerY + dy
            if (staffLines.some((line) => Math.abs(line - rowY) <= 1)) continue
            for (let dx = -halfX; dx <= halfX; dx++) { const value = at(x + dx, rowY); mass += value; moment += value * dy }
          }
          if (mass) score -= Math.abs(moment / mass) / (halfY * 4)
        }
        if (score > bestScore || (score === bestScore && Math.abs(shift) < Math.abs(bestY - y))) { bestScore = score; bestY = centerY }
      }
      if (bestScore >= (crossHead ? 0.78 : 0.58)) peaks.push({ x, score: bestScore, y: bestY })
    }
    for (const peak of peaks.sort((a, b) => b.score - a.score)) {
      if (notes.some((note) => note.instrument === instrument && Math.abs(note.y - y) < staff.gap * 0.4 && Math.abs(note.x - peak.x) < staff.gap * 1.1)) continue
      const headY = peak.y
      let stem = 0; for (let dy = 4; dy < staff.gap * 3; dy++) stem += at(peak.x + halfX, headY - dy)
      let flags = 0; for (let dx = 3; dx < staff.gap; dx++) flags += at(peak.x + halfX + dx, headY - staff.gap * 2)
      notes.push({ id: notes.length, x: peak.x, y: headY, instrument, sourceLabel: profile === 'guide-kit' ? `${instrument} supplied-guide suggestion (staff offset ${offset}; verify)` : profile === 'master-key' ? `${instrument} key-profile suggestion (staff offset ${offset}; verify)` : instrument === 'Hi-hat' ? `Cymbal/Hi-hat candidate (staff offset ${offset})` : `${instrument} suggestion (staff offset ${offset}; verify instrument)`, shape: crossHead ? 'cross' : 'oval', strength: peak.score, stemHint: stem > staff.gap, flagHint: flags > 2 })
    }
  }
  // Reject weaker shoulders of the same oval head at neighboring half-space levels.
  // Equally strong adjacent heads remain available for simultaneous voices.
  const result = notes.map((note) => { if (note.instrument !== 'Hi-hat') return note; const mark = inspectHatMark(image, staff, note.x, note.y); return mark === 'open' ? { ...note, articulationHint: mark, instrument: 'Open hi-hat' as ChartInstrument, sourceLabel: 'Open hi-hat suggestion: possible open circle; verify' } : mark === 'half-open' ? { ...note, articulationHint: mark, sourceLabel: 'Possible half-open hi-hat marker; playback remains closed hi-hat; verify manually' } : note }).filter((note) => note.shape !== 'oval' || !notes.some((other) => other.shape === 'oval' && other.strength > note.strength + (options.cleanHeads ? 0.02 : 0.12) && Math.abs(other.x - note.x) <= staff.gap * 0.65 && Math.abs(other.y - note.y) <= staff.gap * (options.cleanHeads ? 0.8 : 0.6))).sort((a, b) => a.x - b.x)
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
  const bar = completeBar()
  for (const note of notes) { const raw = (note.x - first) / (last - first) * 15; const step = Math.round(raw); if (step >= 0 && step < 16 && Math.abs(raw - step) <= 0.4) bar[note.instrument][step] = 2 }
  return bar
}
/** Distinct vertical-line hints inside slot guides; not confirmed measure parsing. */
export function interiorBarlines(image: RecognitionImage, staff: StaffCandidate, first: number, last: number): number[] {
  if (!Number.isFinite(first) || !Number.isFinite(last) || last <= first) return []
  const lines: number[] = []
  for (const x of findBarlineHints(image, staff)) if (x > first + staff.gap && x < last - staff.gap && (!lines.length || x - lines[lines.length - 1] > staff.gap)) lines.push(x)
  return lines
}
