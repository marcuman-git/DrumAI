import type { NoteCandidate } from './notationRecognition'
export function selectedCandidates(notes: NoteCandidate[], ids: readonly number[]): NoteCandidate[] {
  const selected = new Set(ids)
  return notes.filter((note) => selected.has(note.id))
}
export function alignedCandidates(notes: NoteCandidate[], first: number, last: number): NoteCandidate[] {
  if (!Number.isFinite(first) || !Number.isFinite(last) || last <= first) return []
  return notes.filter((note) => {
    const raw = (note.x - first) / (last - first) * 15; const step = Math.round(raw)
    return step >= 0 && step < 16 && Math.abs(raw - step) <= 0.4
  })
}
