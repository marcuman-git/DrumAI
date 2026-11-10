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
export function hasOpenHatRing(image: RecognitionImage, staff: StaffCandidate, x: number, y: number): boolean {
  const radius = Math.max(3, Math.round(staff.gap * 0.35)); const centerY = Math.round(y - staff.gap * 1.4)
  if (centerY - radius < 0) return false
  let ring = 0; let core = 0
  for (let step = 0; step < 24; step++) {
    const angle = step / 24 * Math.PI * 2
    const px = Math.round(x + Math.cos(angle) * radius); const py = Math.round(centerY + Math.sin(angle) * radius)
    ring += Math.max(image.ink[py * image.width + px] ?? 0, image.ink[(py + 1) * image.width + px] ?? 0)
  }
  for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) core += image.ink[(centerY + dy) * image.width + Math.round(x) + dx] ?? 0
  return ring >= 20 && core <= 1
}
