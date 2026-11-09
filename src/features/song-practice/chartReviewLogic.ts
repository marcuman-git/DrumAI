import type { ChartBar, SongChart } from './songChartLogic'
import { CHART_INSTRUMENTS, notesFor } from './chartKit'
export type ReviewStatus = 'Pending' | 'Uncertain' | 'Reviewed'
export interface BarReview { status: ReviewStatus; page: number; notes: string; signature: string }
export interface ChartReview { source: string; bars: BarReview[] }
export const SUPPORTED_REVIEW_RULES = [
  '4/4 only; 16 sixteenth-note slots per bar.',
  'Supported kit rows include bass/snare, toms, hi-hat/pedal, Crash and Ride.',
  'Supported cells: rest, normal stroke, ghost stroke and accent.',
  'Longer note values must be entered manually as strike positions; the staff view uses sixteenth slots.',
  'Tuplets, flams, drags, ties, repeats and other meters require manual interpretation and are not recognized.',
  'PDF recognition is experimental; candidate strength is not recognition confidence.',
]
export function barSignature(bar: ChartBar): string {
  const core = [bar['Hi-hat'], bar.Snare, bar.Kick]
  const old = bar.Crash?.some(Boolean) || bar.Ride?.some(Boolean) ? [...core, bar.Crash ?? Array(16).fill(0), bar.Ride ?? Array(16).fill(0)] : core
  const extras = CHART_INSTRUMENTS.slice(5).filter((name) => notesFor(bar, name).some(Boolean)).map((name) => ({ name, notes: notesFor(bar, name) }))
  return JSON.stringify(bar.rhythmEvents ? [...old, ...extras, { rhythmEvents: bar.rhythmEvents }] : extras.length ? [...old, ...extras] : old)
}
export function newChartReview(chart: SongChart): ChartReview { return { source: '', bars: chart.bars.map(() => ({ status: 'Pending', page: 1, notes: '', signature: '' })) } }
export function validChartReview(value: unknown, length: number): value is ChartReview {
  if (!value || typeof value !== 'object') return false
  const review = value as ChartReview
  return typeof review.source === 'string' && review.source.length <= 120 && Array.isArray(review.bars) && review.bars.length === length && review.bars.every((bar) => bar && ['Pending', 'Uncertain', 'Reviewed'].includes(bar.status) && Number.isInteger(bar.page) && bar.page >= 1 && bar.page <= 999 && typeof bar.notes === 'string' && bar.notes.length <= 500 && typeof bar.signature === 'string' && bar.signature.length <= 24000)
}
export function reviewStatus(chart: SongChart, index: number): ReviewStatus {
  const review = chart.review?.bars[index]
  if (!review || !chart.bars[index] || review.signature !== barSignature(chart.bars[index])) return 'Pending'
  return review.status
}
export function normalizeReview(chart: SongChart): SongChart {
  if (!chart.review) return chart
  if (chart.review.bars.length !== chart.bars.length) return { ...chart, review: undefined }
  return { ...chart, review: { ...chart.review, bars: chart.review.bars.map((bar, index) => ({ ...bar, status: reviewStatus(chart, index) })) } }
}
