import type { ChartInstrument } from './chartKit'
import type { NoteCandidate } from './notationRecognition'
import type { NoteValueHint } from './noteValueHints'
export type CandidateFilter = 'all' | 'checked' | 'unchecked' | 'unknown'
export function filterCandidates(notes: NoteCandidate[], accepted: readonly number[], hints: Record<number, NoteValueHint>, filter: CandidateFilter, instrument?: ChartInstrument): NoteCandidate[] {
  const checked = new Set(accepted)
  return notes.filter((note) => (!instrument || note.instrument === instrument) && (filter === 'all' || (filter === 'checked' ? checked.has(note.id) : filter === 'unchecked' ? !checked.has(note.id) : !hints[note.id] || hints[note.id].value === 'unknown')))
}
