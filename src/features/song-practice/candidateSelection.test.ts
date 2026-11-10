import { expect, it } from 'vitest'
import { alignedCandidates, selectedCandidates } from './candidateSelection'
import type { NoteCandidate } from './notationRecognition'
const notes: NoteCandidate[] = [0, 1, 2].map((id) => ({ id, x: [20, 190, 25][id], y: 55, instrument: 'Snare', shape: 'oval', strength: 0.9, stemHint: false, flagHint: false }))
it('keeps checked candidates only, without duplicates or invented ids', () => {
  expect(selectedCandidates(notes, [1, 1, 99]).map((note) => note.id)).toEqual([1])
  expect(selectedCandidates(notes, [])).toEqual([])
})
it('reports candidates that cannot align to the selected slot guides', () => {
  expect(alignedCandidates(notes, 20, 190).map((note) => note.id)).toEqual([0, 1])
  expect(alignedCandidates(notes, 20, 20)).toEqual([])
})
