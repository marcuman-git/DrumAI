import { useState } from 'react'
import type { SetStateAction } from 'react'
import type { SongChart } from './songChartLogic'
import { barSignature, newChartReview, reviewStatus, SUPPORTED_REVIEW_RULES } from './chartReviewLogic'
import type { ReviewStatus } from './chartReviewLogic'
export function ChartImportReview({ chart, setChart, index, playing }: { chart: SongChart; setChart: (update: SetStateAction<SongChart>) => void; index: number; playing: boolean }) {
  const [message, setMessage] = useState('Compare your manual entries with the PDF above. Review does not alter playback or create practice activity.')
  const review = chart.review
  const current = review?.bars[index]
  const reviewed = chart.bars.filter((_, position) => reviewStatus(chart, position) === 'Reviewed').length
  function mark(status: ReviewStatus) {
    setChart((value) => { const metadata = value.review ?? newChartReview(value); return { ...value, review: { ...metadata, bars: metadata.bars.map((bar, position) => position === index ? { ...bar, status, signature: barSignature(value.bars[index]) } : bar) } } })
  }
  return <section aria-label="Chart import review" className="space-y-3 rounded-lg border border-cyan-300/30 bg-cyan-950/20 p-3">
    <h4 className="font-semibold">PDF-to-Chart Review Preparation</h4>
    <p className="text-sm text-zinc-300">Manual review only. Selecting a PDF does not generate notes. Review records are saved with chart JSON; the PDF itself is not included.</p>
    <details><summary className="cursor-pointer text-sm text-cyan-100">Supported notation and limitations</summary><ul className="mt-2 space-y-1 text-xs text-zinc-300">{SUPPORTED_REVIEW_RULES.map((rule) => <li key={rule}>{rule}</li>)}</ul></details>
    {!review ? <button disabled={playing} onClick={() => setChart((value) => ({ ...value, review: newChartReview(value) }))} className="rounded border border-cyan-200/40 px-3 py-2 disabled:opacity-40">Start manual chart review</button> : <>
      <label className="block text-sm">Source PDF name<input aria-label="Review source name" disabled={playing} maxLength={120} value={review.source} onChange={(event) => { const source = event.target.value; setChart((value) => ({ ...value, review: { ...(value.review ?? newChartReview(value)), source, bars: (value.review ?? newChartReview(value)).bars.map((bar) => ({ ...bar, status: 'Pending', signature: '' })) } })) }} className="mt-1 w-full rounded border border-white/25 bg-zinc-900 p-2" placeholder="Optional reference filename" /></label>
      <p className="text-sm text-cyan-100">Reviewed bars: {reviewed} / {chart.bars.length}. Bar {index + 1}: {reviewStatus(chart, index)}</p>
      <label className="block text-sm">Reference page<input aria-label="Review reference page" type="number" min={1} max={999} disabled={playing} value={current?.page ?? 1} onChange={(event) => { const page = Number(event.target.value); if (!Number.isInteger(page) || page < 1 || page > 999) return; setChart((value) => ({ ...value, review: { ...(value.review ?? newChartReview(value)), bars: (value.review ?? newChartReview(value)).bars.map((bar, position) => position === index ? { ...bar, page } : bar) } })) }} className="mt-1 w-full rounded border border-white/25 bg-zinc-900 p-2" /></label>
      <label className="block text-sm">Review notes<textarea aria-label="Bar review notes" disabled={playing} maxLength={500} value={current?.notes ?? ''} onChange={(event) => { const notes = event.target.value; setChart((value) => ({ ...value, review: { ...(value.review ?? newChartReview(value)), bars: (value.review ?? newChartReview(value)).bars.map((bar, position) => position === index ? { ...bar, notes } : bar) } })) }} className="mt-1 min-h-20 w-full rounded border border-cyan-200/40 bg-zinc-800 p-2" placeholder="Unclear ghost note, check kick placement..." /></label>
      <div className="flex flex-wrap gap-2"><button disabled={playing} onClick={() => mark('Reviewed')} className="rounded bg-emerald-800 px-3 py-2 disabled:opacity-40">Mark bar reviewed</button><button disabled={playing} onClick={() => mark('Uncertain')} className="rounded bg-amber-800 px-3 py-2 disabled:opacity-40">Flag bar uncertain</button><button disabled={playing} onClick={() => mark('Pending')} className="rounded border border-white/25 px-3 py-2 disabled:opacity-40">Reset bar review</button></div>
      <button disabled={playing || reviewed !== chart.bars.length} onClick={() => setMessage('Review confirmation recorded. Check the current Reviewed bars count before saving or exporting; edits may require another review.')} className="rounded border border-emerald-300/50 px-3 py-2 disabled:opacity-40">Finish manual review</button>
      <p className="text-xs text-zinc-400">Editing notes makes their review Pending. Adding, duplicating or removing bars resets the review workflow. Review controls are disabled during playback; playback remains available for checking uncertain bars.</p>
    </>}
    <p role="status" className="text-sm text-cyan-100">{message}</p>
  </section>
}
