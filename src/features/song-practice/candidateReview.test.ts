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
it('explains shared-stem conflicts and interrupted paths without rewriting manual durations',()=>{const hints={0:{...quarter,manualReviewed:true,sharedStemNeighbours:[1],interruptedBeamNeighbours:[1],recognitionWarnings:['Low-resolution staff']},1:{...quarter,value:'sixteenth' as const}};const reasons=candidateReviewReasons(snare,[snare],hints).join(' ');expect(reasons).toContain('Shared-stem duration evidence differs');expect(reasons).toContain('Interrupted beam path');expect(reasons).toContain('Low-resolution');expect(hints[0].value).toBe('quarter');expect(hints[1].value).toBe('sixteenth')})
it('reports the independent disagreement without changing a manual duration',()=>{const hints={0:{...quarter,manualReviewed:true,evidenceComparison:{beamBands:1,shortFlagBands:1,curveFlagBands:2,corroboratedFlagBands:2}}};const text=candidateReviewReasons(snare,[snare],hints).join(' ');expect(text).toContain('Beam and connected-curve checks overlap');expect(text).toContain('flag counts differ');expect(hints[0].value).toBe('quarter')})
