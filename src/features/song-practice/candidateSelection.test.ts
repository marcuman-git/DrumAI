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
it('uses eight source slots for a 2/4 draft without accepting unchecked heads', () => {
 const selected = selectedCandidates(notes, [0, 1]); expect(alignedCandidates(selected, 20, 190, 8).map((note) => note.id)).toEqual([0, 1])
})
it('aligns eight evenly spaced source onsets to eighth slots without shifting the later hits', async () => {
 const { candidatesToBar } = await import('./notationRecognition')
 const notes = Array.from({ length: 8 }, (_, id) => ({ id, x: id * 20, y: 30, instrument: 'Hi-hat' as const, shape: 'cross' as const, strength: 1, stemHint: false, flagHint: false }))
 expect(alignedCandidates(notes, 0, 140, 16, 14)).toHaveLength(8)
 const bar = candidatesToBar(notes, 0, 140, 16, 14)
 expect(bar['Hi-hat']).toEqual([2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0])
 const short = candidatesToBar(notes.slice(0, 4), 0, 60, 8, 6)
 expect(short['Hi-hat']?.slice(0, 8)).toEqual([2, 0, 2, 0, 2, 0, 2, 0])
})
