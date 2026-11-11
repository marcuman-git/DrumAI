import type { NoteCandidate, RecognitionImage, StaffCandidate } from './notationRecognition'
export interface NoteValueHint { value: 'quarter' | 'eighth' | 'sixteenth' | 'unknown'; stemDirection: 'up' | 'down' | 'unknown'; beamBands: number; possibleDot?: boolean; left: number; top: number; width: number; height: number }
/** Local stem/beam evidence only. Missing flags, ties and adjacent voices can mislead it. */
export function inspectNoteValue(image: RecognitionImage, staff: StaffCandidate, note: NoteCandidate): NoteValueHint {
  const { width, height, ink } = image; const gap = staff.gap
  if (!Number.isFinite(gap) || gap < 4 || gap > 80 || !Number.isFinite(staff.top)) throw new Error('Invalid staff geometry.')
  const radius = Math.max(2, Math.round(gap * 0.48))
  const at = (x: number, y: number) => x >= 0 && x < width && y >= 0 && y < height ? ink[Math.round(y) * width + Math.round(x)] ?? 0 : 0
  let best = { length: 0, x: note.x, end: note.y, direction: 0 }
  for (const direction of [-1, 1]) for (let shift = -2; shift <= 2; shift++) {
    const x = Math.round(note.x + (direction === -1 ? radius : -radius) + shift)
    let missing = 0; let end = note.y
    for (let distance = 1; distance <= gap * 4.5; distance++) {
      const y = Math.round(note.y + distance * direction)
      if (y < 0 || y >= height) break
      if (at(x, y) || at(x - 1, y) || at(x + 1, y)) { missing = 0; end = y }
      else if (++missing > 2) break
    }
    const length = Math.abs(end - note.y)
    if (length > best.length) best = { length, x, end, direction }
  }
  let bands = 0; let inside = false
  const staffLines = Array.from({ length: 5 }, (_, line) => staff.top + line * gap)
  if (best.length >= gap * 1.6) {
    const distance = Math.min(gap * 1.6, best.length - gap * 0.8)
    for (let index = 0; index <= distance; index++) {
      const y = Math.round(best.end - best.direction * index)
      const onStaff = staffLines.some((line) => Math.abs(line - y) <= 1)
      let supported = false
      if (!onStaff) for (const horizontal of [-1, 1]) {
        let dark = 0; let total = 0
        for (let dx = 3; dx <= gap * 1.5; dx++) { dark += at(best.x + horizontal * dx, y); total++ }
        if (total >= 4 && dark / total >= 0.7) supported = true
      }
      if (supported && !inside) bands++
      inside = supported
    }
  }
  // Short isolated flags may not span the longer beam window. Require a
  // contiguous curved cluster near the stem tip, away from staff lines.
  if (bands === 0 && best.length >= gap * 2) {
    let rows = 0; let longest = 0
    for (let index = 1; index <= gap * 1.4; index++) {
      const y = Math.round(best.end - best.direction * index)
      if (staffLines.some((line) => Math.abs(line - y) <= 1)) { rows = 0; continue }
      let dark = 0
      for (let dx = 3; dx <= Math.max(6, gap * 0.8); dx++) dark += at(best.x + dx, y)
      rows = dark >= 3 ? rows + 1 : 0
      longest = Math.max(longest, rows)
    }
    if (longest >= 3) bands = 1
  }
  // Isolated ink to the right is only tentative dot evidence. Dotted
  // durations are unsupported and must never be silently labelled straight.
  let possibleDot = false
  for (let dx = radius + 3; dx <= gap * 1.6; dx++) for (let dy = -gap * 0.45; dy <= gap * 0.45; dy++) {
    const x = Math.round(note.x + dx); const y = Math.round(note.y + dy)
    if (staffLines.some((line) => Math.abs(line - y) <= 2)) continue
    if (at(x, y) && at(x + 1, y) && at(x, y + 1)
      && !at(x - 2, y) && !at(x + 3, y) && !at(x, y - 2) && !at(x, y + 3)) possibleDot = true
  }
  const left = Math.max(0, Math.floor(note.x - gap * 2)); const right = Math.min(width, Math.ceil(note.x + gap * 2))
  const top = Math.max(0, Math.floor(Math.min(note.y - gap * 0.6, best.end) - 3))
  const bottom = Math.min(height, Math.ceil(Math.max(note.y + gap * 0.6, best.end) + 3))
  return { value: possibleDot || best.length < gap * 1.6 || bands > 2 ? 'unknown' : bands === 2 ? 'sixteenth' : bands === 1 ? 'eighth' : 'quarter', stemDirection: best.length < gap * 1.6 ? 'unknown' : best.direction === -1 ? 'up' : 'down', beamBands: bands, possibleDot, left, top, width: right - left, height: bottom - top }
}
