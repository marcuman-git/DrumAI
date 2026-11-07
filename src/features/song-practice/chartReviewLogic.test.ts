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
