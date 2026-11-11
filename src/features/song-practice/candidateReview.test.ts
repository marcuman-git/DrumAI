import { expect, it } from 'vitest'
import { candidateReviewReasons } from './candidateReview'
import { filterCandidates } from './candidateFilters'
import type { NoteCandidate } from './notationRecognition'
import type { NoteValueHint } from './noteValueHints'
const snare: NoteCandidate = { id: 0, x: 30, y: 40, instrument: 'Snare', shape: 'oval', strength: 1, stemHint: true, flagHint: false }
const quarter: NoteValueHint = { value: 'quarter', stemDirection: 'up', beamBands: 0, left: 0, top: 0, width: 20, height: 40 }
it('flags uncertain dots and unsupported beams with actionable reasons', () => {
 const reasons = candidateReviewReasons(snare, [snare], { 0: { ...quarter, value: 'unknown', possibleDot: true, beamBands: 3 } })
 expect(reasons).toHaveLength(3)
 expect(reasons.join(' ')).toContain('unsupported')
})
it('flags nearby competing voices without changing selections or mapping', () => {
 const kick = { ...snare, id: 1, instrument: 'Kick' as const, y: 43 }
 const notes = [snare, kick]; const accepted = [0, 1]
 expect(filterCandidates(notes, accepted, { 0: quarter, 1: quarter }, 'review')).toEqual(notes)
 expect(accepted).toEqual([0, 1]); expect(snare.instrument).toBe('Snare')
 expect(filterCandidates(notes, accepted, { 0: quarter, 1: quarter }, 'review', 'Kick')).toEqual([kick])
})
it('does not flag separate heads or invent verified instrument confidence', () => {
 expect(candidateReviewReasons(snare, [snare, { ...snare, id: 1, x: 50, instrument: 'Kick' }], { 0: quarter })).toEqual([])
 expect(candidateReviewReasons(snare, [snare], {})).toEqual(['Duration uncertain'])
})
