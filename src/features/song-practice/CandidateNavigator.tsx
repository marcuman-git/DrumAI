import { candidateReviewReasons } from './candidateReview'
import { filterCandidates } from './candidateFilters'
import type { CandidateFilter } from './candidateFilters'
import { FocusedCandidatePreview } from './FocusedCandidatePreview'
import type { CandidatePreviewSource } from './candidatePreviewBounds'
import { useEffect, useRef, useState } from 'react'
import type { NoteCandidate } from './notationRecognition'
import type { NoteValueHint } from './noteValueHints'
import type { ChartInstrument } from './chartKit'
import { CHART_INSTRUMENTS } from './chartKit'
export function CandidateNavigator({ notes, accepted, hints, focusedId, onFocus, onAccept, onMap, onReviewDuration, staff, previewSource }: { notes: NoteCandidate[]; accepted: readonly number[]; hints: Record<number, NoteValueHint>; focusedId: number | null; onFocus: (id: number) => void; onAccept: (id: number, checked: boolean) => void; onMap: (id: number, instrument: NoteCandidate['instrument']) => void; onReviewDuration?: (id: number, value: 'quarter' | 'eighth' | 'sixteenth') => void; staff?: { top: number; gap: number } | null; previewSource?: CandidatePreviewSource }) {
  const [filter, setFilter] = useState<CandidateFilter>('all')
  const [instrument, setInstrument] = useState<ChartInstrument | ''>('')
  const shown = filterCandidates(notes, accepted, hints, filter, instrument || undefined)
  const focused = notes.find((note) => note.id === focusedId)
  const rows = useRef(new Map<number, HTMLDivElement>())
  const index = shown.findIndex((note) => note.id === focusedId)
  useEffect(() => { if (focusedId !== null) rows.current.get(focusedId)?.scrollIntoView?.({ block: 'nearest', behavior: 'smooth' }) }, [focusedId, filter, instrument])
  return <section aria-label="Candidate navigation" className="space-y-2">
    <p className="text-xs text-amber-100">To review duration, choose Quarter, Eighth or Sixteenth below each candidate. Instrument mapping only changes the drum voice. For rests and onset slots, use Duration-aware notation review. Dots, ties and tuplets remain unsupported.</p>
    <button onClick={() => setFilter('review')} className="rounded border border-amber-300/40 px-3 py-2 text-sm">Review uncertain candidates</button>
    <label className="block text-sm">Candidate filter<select aria-label="Candidate filter" value={filter} onChange={(event) => setFilter(event.target.value as CandidateFilter)} className="ml-2 rounded bg-zinc-900 p-2"><option value="all">All candidates</option><option value="checked">Checked only</option><option value="unchecked">Unchecked only</option><option value="unknown">Unknown duration</option><option value="review">Needs review</option></select></label>
    <label className="block text-sm">Instrument filter<select aria-label="Instrument filter" value={instrument} onChange={(event) => setInstrument(event.target.value as ChartInstrument | '')} className="ml-2 rounded bg-zinc-900 p-2"><option value="">All instruments</option>{CHART_INSTRUMENTS.map((name) => <option key={name}>{name}</option>)}</select></label>
    <p className="text-xs text-zinc-300">Showing {shown.length} / {notes.length}. Filtering never unchecks hidden candidates; draft building still uses all checked candidates.</p>
    {focused && !shown.some((note) => note.id === focused.id) && <p className="text-sm text-amber-100">Focused candidate #{focused.id + 1} is hidden by this filter. <button onClick={() => { setFilter('all'); setInstrument('') }} className="rounded border border-white/25 p-1">Show all candidates</button></p>}
    {focused && previewSource && <FocusedCandidatePreview note={focused} source={previewSource} hint={hints[focused.id]} />}
    <div className="flex flex-wrap items-center gap-2"><button disabled={!shown.length || index <= 0} onClick={() => onFocus(shown[index - 1].id)} className="rounded border border-white/25 px-3 py-2 disabled:opacity-40">Previous candidate</button><button disabled={!shown.length || index === shown.length - 1} onClick={() => onFocus(shown[index + 1].id)} className="rounded border border-white/25 px-3 py-2 disabled:opacity-40">Next candidate</button><label className="text-sm">Jump to candidate<select aria-label="Jump to candidate" value={index >= 0 ? focusedId ?? '' : ''} onChange={(event) => { if (event.target.value !== '') onFocus(Number(event.target.value)) }} className="ml-2 rounded bg-zinc-900 p-2"><option value="">Choose</option>{shown.map((note) => <option key={note.id} value={note.id}>#{note.id + 1} {note.instrument} {accepted.includes(note.id) ? '(checked)' : '(unchecked)'}</option>)}</select></label></div>
    <p className="text-xs text-zinc-300">Focus identifies a candidate without checking it. Numbers match the PDF overlay; checking or mapping still requires your verification.</p>
    <div className="max-h-72 space-y-2 overflow-y-auto rounded border border-white/20 p-2">{shown.length ? shown.map((note) => <div key={note.id} ref={(node) => { if (node) rows.current.set(note.id, node); else rows.current.delete(note.id) }} data-testid={`candidate-row-${note.id}`} className={`rounded border p-2 text-xs ${focusedId === note.id ? 'border-cyan-300 bg-cyan-950/40' : 'border-white/15'}`}>
      <button aria-pressed={focusedId === note.id} onClick={() => onFocus(note.id)} className="mr-2 rounded border border-white/25 px-2 py-1">Focus #{note.id + 1}</button>
      {(!hints[note.id] || hints[note.id].value === 'unknown') && <span className="mr-2 rounded bg-amber-900/40 px-2 py-1 text-amber-100">Needs duration review</span>}
      {hints[note.id]?.possibleDot && <span className="text-amber-100">Possible dot: dotted duration unsupported; review manually. </span>}
      {candidateReviewReasons(note, notes, hints).map((reason) => <p key={reason} className="text-amber-100">{reason}</p>)}
      {staff && <p className="text-zinc-300">Source head position: {((note.y - staff.top) / staff.gap).toFixed(2)} staff spaces below the top line. Compare with your source legend, not a universal drum key.</p>}
      {onReviewDuration && <label className="block">Manual duration<select aria-label={`Candidate ${note.id + 1} manual duration`} value={hints[note.id]?.manualReviewed ? hints[note.id].value : ''} onChange={(event) => { if (event.target.value) onReviewDuration(note.id, event.target.value as 'quarter' | 'eighth' | 'sixteenth') }} className="ml-2 rounded bg-zinc-900 p-2"><option value="">Not manually reviewed</option><option value="quarter">Quarter</option><option value="eighth">Eighth</option><option value="sixteenth">Sixteenth</option></select></label>}
      {hints[note.id]?.manualReviewed && <p className="text-emerald-200">Duration set manually. This is your review, not increased detection confidence.</p>}
      <label><input type="checkbox" checked={accepted.includes(note.id)} onChange={(event) => onAccept(note.id, event.target.checked)} /> {note.sourceLabel ?? note.instrument}, x={note.x}, {note.shape}; shape strength {Math.round(note.strength * 100)}%, stem {note.stemHint ? 'possible' : 'unknown'}, flags {note.flagHint ? 'possible' : 'unknown'}; value {hints[note.id]?.value ?? 'unknown'} (possible), beams {hints[note.id]?.beamBands ?? 0}</label>
      <select aria-label={`Map candidate ${note.id}`} value={note.instrument} onChange={(event) => onMap(note.id, event.target.value as NoteCandidate['instrument'])} className="ml-2 rounded bg-zinc-900 p-1">{CHART_INSTRUMENTS.map((instrument) => <option key={instrument}>{instrument}</option>)}</select>
    </div>) : <p className="text-sm">No candidates match this filter. Choose All candidates or rescan if the detection is empty.</p>}</div>
  </section>
}
