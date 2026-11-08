import type { NoteCandidate } from './notationRecognition'
import type { NoteValueHint } from './noteValueHints'

import { reviewRhythm } from './rhythmReviewLogic'

export function RhythmReview({ notes, hints, first, last }: { notes: NoteCandidate[]; hints: Record<string, NoteValueHint>; first: number; last: number }) {
  const result = reviewRhythm(notes, hints, first, last)
  return <section aria-label="Experimental rhythm review" className="rounded border border-amber-300/40 bg-amber-950/20 p-3 text-sm">
    <h4 className="font-semibold">Rhythm review - experimental</h4>
    <p>Accepted candidates: {notes.length}. Unknown durations: {result.unknown}. Outside guides: {result.outside}.</p>
    <p>Possible same-instrument overlaps: {result.conflicts}. Durations crossing the bar end: {result.overflow}.</p>
    <p>Slots without an accepted onset: {result.empty} / 16. These are not recognized PDF rests; sustained notes or missed strokes may occupy them.</p>
    <p className="mt-2 text-xs text-amber-100">Checks assume your evenly spaced sixteenth-slot guides and tentative stem/beam values. Engraved PDF spacing is not necessarily proportional to time. Resolve warnings against the source; this does not change chart notes, apply durations, or validate ties, dots or tuplets.</p>
  </section>
}
