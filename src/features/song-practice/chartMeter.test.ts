import { expect, it } from 'vitest'
import { changeChartMeter, chartSlots } from './chartMeter'
import { newSongChart, isSongChart, parseSongChart, CHART_INSTRUMENTS, notesFor } from './songChartLogic'
import { reviewedBar, fillReviewedRests } from './reviewedRhythm'
it('splits and rejoins every instrument without losing onsets', () => {
 const chart = newSongChart(); chart.bars[0].Crash![15] = 3
 const half = changeChartMeter(chart, '2/4')
 expect(half.bars).toHaveLength(2); expect(chartSlots(half)).toBe(8)
 expect(half.bars[1].Crash![7]).toBe(3); expect(isSongChart(half)).toBe(true)
 const joined = changeChartMeter(half, '4/4')
 for (const instrument of CHART_INSTRUMENTS) expect(notesFor(joined.bars[0], instrument)).toEqual(notesFor(chart.bars[0], instrument))
 expect(isSongChart(joined)).toBe(true)
})
it('persists 2/4 while old saves remain 4/4', () => {
 const chart = newSongChart(); expect(chartSlots(chart)).toBe(16)
 const half = changeChartMeter(chart, '2/4')
 const parsed = parseSongChart(JSON.stringify({ app: 'DrumMaster AI Chart', schema: 1, chart: half }))
 expect(parsed.meter).toBe('2/4'); expect(parsed.bars[0].beats).toBe(2)
 parsed.bars[0].Kick[12] = 2
 expect(isSongChart(parsed)).toBe(false)
})
it('preserves reviewed durations and creates ties at a crossing split', () => {
 const chart = newSongChart()
 chart.bars = [reviewedBar(fillReviewedRests([{ instrument: 'Snare', step: 0, duration: 4, kind: 'note', dynamic: 2 }], 'Snare'))]
 expect(isSongChart(changeChartMeter(chart, '2/4'))).toBe(true)
 chart.bars = [reviewedBar(fillReviewedRests([{ instrument: 'Snare', step: 6, duration: 4, kind: 'note', dynamic: 2 }], 'Snare'))]
 const split=changeChartMeter(chart, '2/4');expect(isSongChart(split)).toBe(true);expect(split.bars[1].Snare![0]).toBe(0);expect(split.bars[1].rhythmEvents!.some(event=>event.step===0&&event.tieFromPrevious)).toBe(true)
})
it('refuses oversized splits and incomplete joins rather than dropping notes', () => {
 const chart = newSongChart(); chart.bars = Array.from({ length: 9 }, () => structuredClone(chart.bars[0]))
 expect(() => changeChartMeter(chart, '2/4')).toThrow(/exceed 16/)
 const half = changeChartMeter(newSongChart(), '2/4'); half.bars.pop()
 expect(() => changeChartMeter(half, '4/4')).toThrow(/second 2\/4 bar/)
})
