import { expect, it } from 'vitest'
import { diagnoseReviewedRhythm, fillNextReviewedGap, formatSlotRanges } from './reviewedRhythmDiagnostics'
import type { RhythmEvent } from './rhythmTypes'
const event: RhythmEvent = { instrument: 'Snare', step: 0, duration: 4, kind: 'note', dynamic: 2 }
it('reports exact missing ranges and overlapping events per voice', () => {
 const voice = diagnoseReviewedRhythm([event, { ...event, step: 2 }, { ...event, step: 10, duration: 2 }])[0]
 expect(formatSlotRanges(voice.gaps)).toBe('7-10, 13-16')
 expect(formatSlotRanges(voice.overlaps)).toBe('3-4')
 expect(voice.conflictEvents).toEqual([0, 1])
})
it('does not confuse simultaneous different instruments with overlaps', () => {
 const voices = diagnoseReviewedRhythm([event, { ...event, instrument: 'Kick' }])
 expect(voices.every((voice) => voice.overlaps.length === 0)).toBe(true)
})
it('identifies exact event crossing the bar end even when global validation fails', () => {
 expect(diagnoseReviewedRhythm([{ ...event, step: 14 }])[0].overflowEvents).toEqual([0])
})
it('fills only the first gap with explicit rests and preserves notes and other voices', () => {
 const events: RhythmEvent[] = [event, { ...event, step: 8 }, { ...event, instrument: 'Kick' }]
 const next = fillNextReviewedGap(events, 'Snare')
 expect(next.slice(0, 3)).toEqual(events)
 expect(next.slice(3)).toEqual([{ ...event, step: 4, kind: 'rest' }])
 expect(formatSlotRanges(diagnoseReviewedRhythm(next).find((voice) => voice.instrument === 'Snare')!.gaps)).toBe('13-16')
 expect(events).toHaveLength(3)
})
it('fills a new voice explicitly but never exceeds the event limit', () => {
 expect(fillNextReviewedGap([], 'Kick')).toHaveLength(4)
 const full = Array.from({ length: 192 }, () => ({ ...event }))
 expect(fillNextReviewedGap(full, 'Kick')).toEqual(full)
})
