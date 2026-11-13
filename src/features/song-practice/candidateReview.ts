import type { NoteCandidate } from './notationRecognition'
import type { NoteValueHint } from './noteValueHints'
/** Review guidance only: never changes acceptance, mapping, durations or playback. */
export function candidateReviewReasons(note: NoteCandidate, notes: readonly NoteCandidate[], hints: Record<number, NoteValueHint>): string[] {
  const hint = hints[note.id]
  const reasons: string[] = []
  if (!hint || hint.value === 'unknown') reasons.push('Duration uncertain')
  if (hint?.possibleDot) reasons.push('Possible dot: dotted duration unsupported')
  if ((hint?.beamBands ?? 0) > 2) reasons.push('More than two beams: shorter durations unsupported')
  if (notes.some((other) => other.id !== note.id && other.instrument !== note.instrument && Math.abs(other.x - note.x) <= 4 && Math.abs(other.y - note.y) <= 4)) reasons.push('Nearby competing instrument suggestion: compare with source legend')
  if (note.articulationHint === 'half-open') reasons.push('Half-open articulation unsupported in playback')
  if (note.cymbalHint === 'ledger-cross') reasons.push('Crossed ledger-line cymbal: verify Crash against source legend')
  return reasons
}
