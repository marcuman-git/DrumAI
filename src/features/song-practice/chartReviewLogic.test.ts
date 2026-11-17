import { describe, expect, it } from 'vitest'
import { barSignature, newChartReview, normalizeReview, reviewStatus, validChartReview } from './chartReviewLogic'
import { cycleChartNote, isSongChart, newSongChart, parseSongChart } from './songChartLogic'
describe('manual chart review preparation', () => {
  it('marks edited notes pending without discarding review notes', () => {
    let chart = newSongChart(); chart.review = newChartReview(chart)
    chart.review.bars[0] = { status: 'Reviewed', page: 2, notes: 'Checked backbeat', signature: barSignature(chart.bars[0]) }
    expect(reviewStatus(chart, 0)).toBe('Reviewed')
    chart = cycleChartNote(chart, 0, 'Snare', 0)
    expect(reviewStatus(chart, 0)).toBe('Pending')
    const normalized = normalizeReview(chart)
    expect(normalized.review?.bars[0].status).toBe('Pending')
    expect(normalized.review?.bars[0].notes).toBe('Checked backbeat')
  })
  it('validates review metadata and round-trips source references', () => {
    const chart = newSongChart(); chart.review = newChartReview(chart); chart.review.source = 'practice.pdf'
    expect(parseSongChart(JSON.stringify({ app: 'DrumMaster AI Chart', schema: 1, chart })).review?.source).toBe('practice.pdf')
    expect(validChartReview({ ...chart.review, bars: [] }, 1)).toBe(false)
    expect(validChartReview({ ...chart.review, source: 'x'.repeat(121) }, 1)).toBe(false)
    expect(isSongChart({ ...chart, review: { ...chart.review, bars: [{ ...chart.review.bars[0], page: 0 }] } })).toBe(false)
    expect(isSongChart(newSongChart())).toBe(true)
  })
})

import {restructureReview,referencePages} from './chartReviewLogic'
it('maps references through duplication, removal and new blank bars without mutating the originals',()=>{
 const chart=newSongChart();chart.bars.push(structuredClone(chart.bars[0]));chart.review=newChartReview(chart);chart.review.source='study.pdf';chart.review.bars[0]={page:2,additionalPages:[3],status:'Reviewed',notes:'Check first',signature:barSignature(chart.bars[0])};chart.review.bars[1].page=5
 const mapped=restructureReview(chart,[[1],[0],[0],[]])!;expect(mapped.source).toBe('study.pdf');expect(mapped.bars.map(referencePages)).toEqual([[5],[2,3],[2,3],[1]]);expect(mapped.bars.every(b=>b.status==='Pending'&&b.signature==='')).toBe(true);expect(mapped.bars[1].notes).toBe('Check first');expect(chart.review.bars[0].status).toBe('Reviewed')
 expect(restructureReview(newSongChart(),[[0]])).toBeUndefined()
})
it('validates additional pages and keeps legacy JSON and multi-page JSON compatible',()=>{
 const chart=newSongChart();chart.review=newChartReview(chart);chart.review.bars[0].additionalPages=[2,999];expect(isSongChart(chart)).toBe(true);expect(parseSongChart(JSON.stringify({app:'DrumMaster AI Chart',schema:1,chart})).review?.bars[0].additionalPages).toEqual([2,999])
 for(const pages of [[0],[1000],[1.5],Array(999).fill(2),'2'])expect(isSongChart({...chart,review:{...chart.review,bars:[{...chart.review.bars[0],additionalPages:pages}]}})).toBe(false)
})
