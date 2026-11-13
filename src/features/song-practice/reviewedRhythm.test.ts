import { expect, it } from 'vitest'
import { checkReviewedRhythm, fillReviewedRests, reviewedBar, validRhythmEvents } from './reviewedRhythm'
import type { RhythmEvent } from './reviewedRhythm'
import { cycleChartNote, newSongChart, parseSongChart } from './songChartLogic'
const event: RhythmEvent = { instrument: 'Snare', step: 0, duration: 4, kind: 'note', dynamic: 2 }
it('requires complete independent voices and rejects overlaps and overflow', () => {
  expect(checkReviewedRhythm([event]).valid).toBe(false)
  const complete = fillReviewedRests([event], 'Snare')
  expect(checkReviewedRhythm(complete).valid).toBe(true)
  expect(checkReviewedRhythm([...complete, event]).overlaps).toBe(4)
  expect(checkReviewedRhythm([...complete, { ...event, instrument: 'Kick' }]).valid).toBe(false)
  expect(validRhythmEvents([{ ...event, step: 15 }])).toBe(false)
  expect(validRhythmEvents([{ ...event, instrument: 'Unknown' }])).toBe(false)
})
it('preserves reviewed durations in JSON and clears metadata on grid edits', () => {
  const bar = reviewedBar(fillReviewedRests([event], 'Snare'))
  const chart = { ...newSongChart(), bars: [bar] }
  const parsed = parseSongChart(JSON.stringify({ app: 'DrumMaster AI Chart', schema: 1, chart }))
  expect(parsed.bars[0].rhythmEvents).toEqual(bar.rhythmEvents)
  expect(bar.Snare.slice(0, 4)).toEqual([2, 0, 0, 0])
  expect(cycleChartNote(chart, 0, 'Snare', 0).bars[0].rhythmEvents).toBeUndefined()
  expect(() => reviewedBar([event])).toThrow()
})
it('rejects malformed metadata and unrepresented grid strokes without throwing', () => {
  const chart = { ...newSongChart(), bars: [reviewedBar(fillReviewedRests([event], 'Snare'))] }
  chart.bars[0].Kick[3] = 2
  expect(() => parseSongChart(JSON.stringify({ app: 'DrumMaster AI Chart', schema: 1, chart }))).toThrow()
  const malformed = { ...chart, bars: [{ ...chart.bars[0], rhythmEvents: null }] }
  expect(() => parseSongChart(JSON.stringify({ app: 'DrumMaster AI Chart', schema: 1, chart: malformed }))).toThrow('Invalid drum chart')
})
it('does not export temporary source candidate references into saved reviewed bars', () => {
 const events = fillReviewedRests([{ instrument: 'Snare', step: 0, duration: 4, kind: 'note', dynamic: 2, sourceCandidateId: 7 }], 'Snare')
 const bar = reviewedBar(events)
 expect(bar.rhythmEvents![0].sourceCandidateId).toBeUndefined()
 expect(events[0].sourceCandidateId).toBe(7)
})
