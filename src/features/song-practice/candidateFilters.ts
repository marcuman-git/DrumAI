import type { NoteCandidate } from './notationRecognition'
import type { NoteValueHint } from './noteValueHints'
export type CandidateFilter = 'all' | 'checked' | 'unchecked' | 'unknown'
export function filterCandidates(notes: NoteCandidate[], accepted: readonly number[], hints: Record<number, NoteValueHint>, filter: CandidateFilter): NoteCandidate[] {
  const checked = new Set(accepted)
  return notes.filter((note) => filter === 'all' || (filter === 'checked' ? checked.has(note.id) : filter === 'unchecked' ? !checked.has(note.id) : !hints[note.id] || hints[note.id].value === 'unknown'))
}
