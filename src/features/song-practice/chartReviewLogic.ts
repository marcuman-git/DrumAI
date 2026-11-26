import {validSourceCrop,type SourceCrop} from './sourceTrace'
import type { ChartBar, SongChart } from './songChartLogic'
import { CHART_INSTRUMENTS, notesFor } from './chartKit'
export type ReviewStatus = 'Pending' | 'Uncertain' | 'Reviewed'
export interface BarReview { status: ReviewStatus; page: number; crops?:SourceCrop[];additionalPages?: number[]; notes: string; signature: string }
export interface ChartReview { source: string; bars: BarReview[] }
export const SUPPORTED_REVIEW_RULES = [
  '4/4 and 2/4; 16 or 8 underlying timing slots per bar.',
  'Supported kit rows include bass/snare, toms, hi-hat/pedal, Crash and Ride.',
  'Supported cells: rest, normal stroke, ghost stroke and accent.',
  'Reviewed durations support long/dotted values,32nds/64ths and3:2 triplets; counting remains a separate display choice.',
  'Adjacent ties, flam/drag grace groups and listed articulations support manual source review. MusicXML expands bounded repeats/endings; other meters and tuplets require manual preparation.',
  'PDF recognition is experimental; candidate strength is not recognition confidence.',
]
export function barSignature(bar: ChartBar): string {
  const core = [bar['Hi-hat'], bar.Snare, bar.Kick]
  const old = bar.Crash?.some(Boolean) || bar.Ride?.some(Boolean) ? [...core, bar.Crash ?? Array(16).fill(0), bar.Ride ?? Array(16).fill(0)] : core
  const extras = CHART_INSTRUMENTS.slice(5).filter((name) => notesFor(bar, name).some(Boolean)).map((name) => ({ name, notes: notesFor(bar, name) }))
  const data = bar.rhythmEvents ? [...old, ...extras, { rhythmEvents: bar.rhythmEvents }] : extras.length ? [...old, ...extras] : old
  return JSON.stringify(bar.beats === 2 ? [...data, { beats: 2 }] : data)
}
export function newChartReview(chart: SongChart): ChartReview { return { source: '', bars: chart.bars.map(() => ({ status: 'Pending', page: 1, notes: '', signature: '' })) } }
export function validChartReview(value: unknown, length: number): value is ChartReview {
  if (!value || typeof value !== 'object') return false
  const review = value as ChartReview
  return typeof review.source === 'string' && review.source.length <= 120 && Array.isArray(review.bars) && review.bars.length === length && review.bars.every((bar) => bar && ['Pending', 'Uncertain', 'Reviewed'].includes(bar.status) && Number.isInteger(bar.page) && bar.page >= 1 && bar.page <= 999 && (bar.additionalPages === undefined || Array.isArray(bar.additionalPages) && bar.additionalPages.length <= 998 && bar.additionalPages.every(page=>Number.isInteger(page)&&page>=1&&page<=999)) && (bar.crops===undefined||Array.isArray(bar.crops)&&bar.crops.length<=16&&bar.crops.every(validSourceCrop)) && typeof bar.notes === 'string' && bar.notes.length <= 500 && typeof bar.signature === 'string' && bar.signature.length <= 1000000)
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

/** Same-bar edits retain filenames/pages while invalidating affected verification. Structural edits map references separately. */
export function reviewAfterBarEdits(chart:SongChart,bars:ChartBar[]):ChartReview|undefined {
 if(!chart.review||chart.review.bars.length!==bars.length)return undefined
 return {...chart.review,bars:chart.review.bars.map((reference,index)=>barSignature(chart.bars[index])!==barSignature(bars[index])?{...reference,status:'Pending',signature:''}:reference)}
}

export function referencePages(reference:BarReview):number[]{return [...new Set([reference.page,...reference.additionalPages??[],...(reference.crops??[]).map(c=>c.page)])]}
/** Map original bar references through split, join, duplication, addition and removal. */
export function restructureReview(chart:SongChart,groups:readonly (readonly number[])[]):ChartReview|undefined {
 if(!chart.review)return undefined
 return {...chart.review,bars:groups.map(group=>{
  const references=group.map(index=>chart.review!.bars[index]).filter(Boolean)
  const pages=[...new Set(references.flatMap(referencePages))]
  const notes=[...new Set(references.map(reference=>reference.notes).filter(Boolean))].join(' / ').slice(0,500)
  const crops=[...new Map(references.flatMap(r=>r.crops??[]).map(c=>[JSON.stringify(c),c])).values()];if(crops.length>16)throw new Error('Too many source crops to combine in one bar.')
  return {status:'Pending',page:pages[0]??1,...(crops.length?{crops}:{}),...(pages.length>1?{additionalPages:pages.slice(1)}:{}),notes,signature:''}
 })}
}
