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
 const chart = newSongChart(); chart.bars = Array.from({ length: 129 }, () => structuredClone(chart.bars[0]))
 expect(() => changeChartMeter(chart, '2/4')).toThrow(/exceed256/)
 const half = changeChartMeter(newSongChart(), '2/4'); half.bars.pop()
 expect(() => changeChartMeter(half, '4/4')).toThrow(/second 2\/4 bar/)
})

import {newChartReview,referencePages,barSignature} from './chartReviewLogic'
it('retains distinct joined source pages through split/join and resets verification without losing notes',()=>{
 const halves=changeChartMeter(newSongChart(),'2/4');halves.bars[0].Snare[0]=2;halves.bars[1].Kick[7]=3;halves.review=newChartReview(halves);halves.review.source='study.pdf';halves.review.bars=halves.review.bars.map((r,i)=>({...r,page:i+2,notes:'Half '+i,status:'Reviewed',signature:barSignature(halves.bars[i])}))
 const joined=changeChartMeter(halves,'4/4');expect(joined.review?.source).toBe('study.pdf');expect(referencePages(joined.review!.bars[0])).toEqual([2,3]);expect(joined.review?.bars[0].notes).toBe('Half 0 / Half 1');expect(joined.review?.bars[0].status).toBe('Pending');expect(joined.bars[0].Kick[15]).toBe(3)
 const split=changeChartMeter(joined,'2/4');expect(split.review?.bars.map(referencePages)).toEqual([[2,3],[2,3]]);expect(isSongChart(split)).toBe(true);expect(split.bars[0].Snare[0]).toBe(2)
})
