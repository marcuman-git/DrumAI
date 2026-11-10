import type { RecognitionImage, StaffCandidate } from './notationRecognition'
export function percussionClefHint(image: RecognitionImage, staff: StaffCandidate): { left: number; right: number } | null {
  const gap = staff.gap; const top = Math.round(staff.top + gap); const bottom = Math.round(staff.top + 3 * gap)
  const at = (x: number, y: number) => image.ink[y * image.width + x] ?? 0
  const limit = Math.min(Math.round(image.width * 0.3), Math.round(gap * 8))
  const strokes: number[] = []
  for (let x = 1; x < limit; x++) {
    let ink = 0; let beyond = 0
    for (let y = top; y <= bottom; y++) ink += at(x, y)
    for (let dy = 3; dy < gap * 0.7; dy++) beyond += at(x, top - dy) + at(x, bottom + dy)
    if (ink >= gap * 1.8 && beyond <= 1 && (!strokes.length || x - strokes[strokes.length - 1] > gap * 0.25)) strokes.push(x)
  }
  for (let index = 1; index < strokes.length; index++) if (strokes[index] - strokes[index - 1] >= gap * 0.3 && strokes[index] - strokes[index - 1] <= gap) return { left: strokes[index - 1] - 2, right: strokes[index] + 2 }
  return null
}
export function inspectHatMark(image: RecognitionImage, staff: StaffCandidate, x: number, y: number): 'open' | 'half-open' | null {
  const radius = Math.max(3, Math.round(staff.gap * 0.35))
  const at = (px: number, py: number) => px >= 0 && px < image.width && py >= 0 && py < image.height ? image.ink[Math.round(py) * image.width + Math.round(px)] ?? 0 : 0
  for (let distance = staff.gap; distance <= staff.gap * 4; distance += Math.max(1, staff.gap * 0.2)) for (const dx of [0, -2, 2, Math.round(staff.gap * 0.5)]) {
    const cx = Math.round(x + dx); const cy = Math.round(y - distance)
    if (cy - radius < 0 || cx - radius < 0 || cx + radius >= image.width) continue
    let ring = 0; let core = 0; let vertical = 0
    for (let step = 0; step < 24; step++) { const angle = step / 24 * Math.PI * 2; const px = Math.round(cx + Math.cos(angle) * radius); const py = Math.round(cy + Math.sin(angle) * radius); ring += Math.max(at(px, py), at(px, py + 1)) }
    for (let dy = -1; dy <= 1; dy++) for (let ox = -1; ox <= 1; ox++) core += at(cx + ox, cy + dy)
    if (ring < 20) continue
    if (core <= 1) return 'open'
    for (let dy = -radius - 2; dy <= radius + 2; dy++) vertical += at(cx, cy + dy)
    if (core >= 3 && core <= 5 && vertical >= radius * 2 + 3) return 'half-open'
  }
  return null
}
export function hasOpenHatRing(image: RecognitionImage, staff: StaffCandidate, x: number, y: number): boolean { return inspectHatMark(image, staff, x, y) === 'open' }
