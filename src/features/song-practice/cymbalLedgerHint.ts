import type { RecognitionImage, StaffCandidate } from './notationRecognition'
/** Tentative source-style evidence, never a universal Crash identity rule. */
export function hasIsolatedCymbalLedger(image: RecognitionImage, staff: StaffCandidate, x: number, y: number): boolean {
 if (y >= staff.top - staff.gap * 0.3) return false
 const at = (px: number, py: number) => px >= 0 && py >= 0 && px < image.width && py < image.height ? image.ink[Math.round(py) * image.width + Math.round(px)] ?? 0 : 0
 for (let row = Math.round(y - staff.gap * 0.5); row <= y + staff.gap * 0.5; row++) {
  let left = 0; let right = 0; let count = 0; let outside = 0; let outerCount = 0
  for (let dx = Math.ceil(staff.gap * 0.55); dx <= staff.gap; dx++) { left += at(x - dx, row); right += at(x + dx, row); count++ }
  for (let dx = Math.ceil(staff.gap * 1.3); dx <= staff.gap * 1.8; dx++) { outside += at(x - dx, row) + at(x + dx, row); outerCount += 2 }
  if (count >= 2 && left / count >= 0.7 && right / count >= 0.7 && outerCount && outside / outerCount <= 0.2) return true
 }
 return false
}
