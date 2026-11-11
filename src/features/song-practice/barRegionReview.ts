import { interiorBarlines } from './notationRecognition'
import type { NoteCandidate, RecognitionImage, StaffCandidate } from './notationRecognition'
/** Note stems may span all five staff lines. Hints remain heuristic, not measure parsing. */
export function reviewBarRegion(image: RecognitionImage, staff: StaffCandidate, notes: readonly NoteCandidate[], first: number, last: number) {
 const boundaries = interiorBarlines(image, staff, first, last)
 const probableBoundaries = boundaries.filter((x) => !notes.some((note) => Math.abs(note.x - x) <= staff.gap * 0.7))
 return { probableBoundaries, discountedStems: boundaries.length - probableBoundaries.length, multipleStaffs: image.staffs.length > 1 }
}
