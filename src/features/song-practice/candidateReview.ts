import { identityStatus } from './cymbalIdentityReview'
import type { NoteCandidate } from './notationRecognition'
import type { NoteValueHint } from './noteValueHints'
/** Review guidance only: never changes acceptance, mapping, durations or playback. */
export function candidateReviewReasons(note: NoteCandidate, notes: readonly NoteCandidate[], hints: Record<number, NoteValueHint>): string[] {
  const hint = hints[note.id]
  const reasons: string[] = []
  if (!hint || hint.value === 'unknown') reasons.push('Duration uncertain')
  if (hint?.possibleDot) reasons.push('Possible dot: dotted duration unsupported')
  if (hint?.clippedStem) reasons.push('Stem reaches crop edge: expand the scan before reviewing duration')
  if ((hint?.flagBands ?? 0) > 2) reasons.push('More than two flags: shorter durations unsupported')
  if ((hint?.beamBands ?? 0) > 2) reasons.push('More than two beams: shorter durations unsupported')
  if (notes.some((other) => other.id !== note.id && other.instrument !== note.instrument && Math.abs(other.x - note.x) <= 4 && Math.abs(other.y - note.y) <= 4)) reasons.push('Nearby competing instrument suggestion: compare with source legend')
  if (identityStatus(note)==='unsupported') reasons.push('Unsupported cymbal identity: exclude this candidate')
  if (identityStatus(note)!=='verified' && note.symbolHint === 'circled-cross') reasons.push('Circled cymbal head: source-specific identity; verify legend or leave unchecked')
  if (identityStatus(note)!=='verified' && note.positionHint === 'ambiguous') reasons.push('Cross center near top line: Hi-hat/Ride position ambiguous; verify manually')
  if (note.articulationHint === 'half-open') reasons.push('Half-open articulation unsupported in playback')
  if (identityStatus(note)!=='verified' && note.cymbalHint === 'ledger-cross') reasons.push('Crossed ledger-line cymbal: verify Crash against source legend')
  return reasons
}
