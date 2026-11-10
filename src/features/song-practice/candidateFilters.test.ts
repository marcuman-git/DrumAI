import { expect, it } from 'vitest'
import { filterCandidates } from './candidateFilters'
import type { NoteCandidate } from './notationRecognition'
import type { NoteValueHint } from './noteValueHints'
const notes: NoteCandidate[] = [0, 1].map((id) => ({ id, x: 20, y: 55, instrument: 'Snare', shape: 'oval', strength: 0.9, stemHint: false, flagHint: false }))
it('filters only the view and treats missing duration hints as unknown', () => {
  const accepted = [1]; const hints = { 1: { value: 'quarter' } as NoteValueHint }
  expect(filterCandidates(notes, accepted, hints, 'all')).toEqual(notes)
  expect(filterCandidates(notes, accepted, hints, 'checked').map((note) => note.id)).toEqual([1])
  expect(filterCandidates(notes, accepted, hints, 'unchecked').map((note) => note.id)).toEqual([0])
  expect(filterCandidates(notes, accepted, hints, 'unknown').map((note) => note.id)).toEqual([0])
  expect(accepted).toEqual([1]); expect(notes).toHaveLength(2)
})
it('combines instrument and checked filters without changing selection', () => {
  const kitNotes: NoteCandidate[] = [{ ...notes[0], instrument: 'Floor tom 1' }, { ...notes[1], instrument: 'Open hi-hat' }]
  expect(filterCandidates(kitNotes, [0, 1], {}, 'checked', 'Floor tom 1').map((note) => note.id)).toEqual([0])
  expect(filterCandidates(kitNotes, [0], {}, 'checked', 'Open hi-hat')).toEqual([])
})
