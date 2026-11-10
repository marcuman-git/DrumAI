import type { RecognitionImage, StaffCandidate } from './notationRecognition'
export interface RestCandidate { id: number; x: number; y: number; duration: 1 | 2 | 4; strength: number }
// Conservative template hints, not a general OCR model. Staff lines are excluded.
export const REST_TEMPLATES = [
  { duration: 4 as const, rows: ['0001000','0011000','0001100','0000110','0001100','0011000','0010000','0011000','0001100'] },
  { duration: 2 as const, rows: ['0011000','0111100','0011100','0001000','0001000','0010000','0010000','0010000','0100000'] },
  { duration: 1 as const, rows: ['0011000','0111100','0011100','0001000','0011000','0111100','0011100','0010000','0100000'] },
]
export function detectRestHints(image: RecognitionImage, staff: StaffCandidate, heads: readonly { x: number; y: number }[] = []): RestCandidate[] {
  if (!Number.isFinite(staff.top) || !Number.isFinite(staff.gap) || staff.gap < 4 || staff.gap > 80) throw new Error('Invalid staff geometry.')
  if (image.width * Math.min(image.height, staff.gap * 5) > 150000) throw new Error('Crop one smaller bar before detecting rest hints.')
  const found: RestCandidate[] = []; const scale = Math.max(1, Math.round(staff.gap / 5))
  const lines = Array.from({ length: 5 }, (_, index) => Math.round(staff.top + index * staff.gap))
  for (let y = Math.max(0, Math.round(staff.top - staff.gap)); y < Math.min(image.height - 9 * scale, staff.top + 4 * staff.gap); y++) {
    for (let x = 0; x < image.width - 7 * scale; x++) {
      if (!image.ink[y * image.width + x + 3 * scale]) continue
      if (heads.some((head) => Math.abs(head.x - (x + 3 * scale)) < staff.gap && Math.abs(head.y - (y + 4 * scale)) < staff.gap)) continue
      for (const template of REST_TEMPLATES) {
      let hit = 0; let expected = 0; let extra = 0; let empty = 0
      template.rows.forEach((row, dy) => [...row].forEach((pixel, dx) => {
        const py = y + dy * scale
        if (lines.some((line) => Math.abs(line - py) <= 1)) return
        const ink = image.ink[py * image.width + x + dx * scale] !== 0
        if (pixel === '1') { expected++; if (ink) hit++ } else { empty++; if (ink) extra++ }
      }))
      const score = expected >= 10 && empty > 0 ? hit / expected - extra / empty : 0
      if (score >= 0.9 && !found.some((item) => Math.abs(item.x - (x + 3 * scale)) < 7 * scale && Math.abs(item.y - (y + 4 * scale)) < 9 * scale)) found.push({ id: found.length, x: x + 3 * scale, y: y + 4 * scale, duration: template.duration, strength: score })
      if (found.length >= 64) return found
      }
    }
  }
  return found
}
