import type {RhythmEvent} from './rhythmTypes'
import {checkReviewedRhythm} from './reviewedRhythm'
import { candidateReviewReasons } from './candidateReview'
import type { NoteCandidate } from './notationRecognition'
import type { NoteValueHint } from './noteValueHints'

import { reviewRhythm } from './rhythmReviewLogic'

export function RhythmReview({ events=[],notes, hints, first, last, slots = 16, lastGuideStep = slots - 1 }: { events?:RhythmEvent[];notes: NoteCandidate[]; hints: Record<string, NoteValueHint>; first: number; last: number; slots?: number; lastGuideStep?: number }) {
  const needsReview = notes.filter((note) => candidateReviewReasons(note, notes, hints).length > 0).length
  const result = reviewRhythm(notes, hints, first, last, slots, lastGuideStep)
  const reviewed=events.length?checkReviewedRhythm(events,slots):null
  return <section aria-label="Experimental rhythm review" className="rounded border border-amber-300/40 bg-amber-950/20 p-3 text-sm">
    <h4 className="font-semibold">Rhythm review - experimental</h4>
    <p className="text-amber-100">Checked candidates needing review: {needsReview}. Instrument suggestions are not verified identities; simultaneous voices can also appear close together.</p>
    <p>Accepted candidates: {notes.length}. Unknown durations: {result.unknown}. Outside guides: {result.outside}.</p>
    {reviewed?<p>Reviewed event timing: {reviewed.voices} voices; {reviewed.overlaps} overlapping slots; {reviewed.missing} missing slots. {reviewed.valid?'Coverage complete; verify the source.':'Correct reviewed events before confirmation.'}</p>:<><p>Possible same-instrument overlaps: {result.conflicts}. Durations crossing the bar end: {result.overflow}.</p>
    <p>Slots without an accepted onset: {result.empty} / {slots}. These are not recognized PDF rests; sustained notes or missed strokes may occupy them.</p>
    <p className="mt-2 text-xs text-amber-100">Checks assume your evenly spaced sixteenth-slot guides and tentative stem/beam values. Engraved PDF spacing is not necessarily proportional to time. Resolve warnings against the source; this does not change chart notes, apply durations, or validate ties, dots or tuplets.</p></>}
  </section>
}
