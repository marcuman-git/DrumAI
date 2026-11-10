import { useEffect, useRef } from 'react'
import type { NoteCandidate } from './notationRecognition'
import type { NoteValueHint } from './noteValueHints'
import { CHART_INSTRUMENTS } from './chartKit'
export function CandidateNavigator({ notes, accepted, hints, focusedId, onFocus, onAccept, onMap }: { notes: NoteCandidate[]; accepted: readonly number[]; hints: Record<number, NoteValueHint>; focusedId: number | null; onFocus: (id: number) => void; onAccept: (id: number, checked: boolean) => void; onMap: (id: number, instrument: NoteCandidate['instrument']) => void }) {
  const rows = useRef(new Map<number, HTMLDivElement>())
  const index = notes.findIndex((note) => note.id === focusedId)
  useEffect(() => { if (focusedId !== null) rows.current.get(focusedId)?.scrollIntoView?.({ block: 'nearest', behavior: 'smooth' }) }, [focusedId])
  return <section aria-label="Candidate navigation" className="space-y-2">
    <div className="flex flex-wrap items-center gap-2"><button disabled={!notes.length || index <= 0} onClick={() => onFocus(notes[index - 1].id)} className="rounded border border-white/25 px-3 py-2 disabled:opacity-40">Previous candidate</button><button disabled={!notes.length || index === notes.length - 1} onClick={() => onFocus(notes[index + 1].id)} className="rounded border border-white/25 px-3 py-2 disabled:opacity-40">Next candidate</button><label className="text-sm">Jump to candidate<select aria-label="Jump to candidate" value={focusedId ?? ''} onChange={(event) => { if (event.target.value !== '') onFocus(Number(event.target.value)) }} className="ml-2 rounded bg-zinc-900 p-2"><option value="">Choose</option>{notes.map((note) => <option key={note.id} value={note.id}>#{note.id + 1} {note.instrument} {accepted.includes(note.id) ? '(checked)' : '(unchecked)'}</option>)}</select></label></div>
    <p className="text-xs text-zinc-300">Focus identifies a candidate without checking it. Numbers match the PDF overlay; checking or mapping still requires your verification.</p>
    <div className="max-h-72 space-y-2 overflow-y-auto rounded border border-white/20 p-2">{notes.length ? notes.map((note) => <div key={note.id} ref={(node) => { if (node) rows.current.set(note.id, node); else rows.current.delete(note.id) }} data-testid={`candidate-row-${note.id}`} className={`rounded border p-2 text-xs ${focusedId === note.id ? 'border-cyan-300 bg-cyan-950/40' : 'border-white/15'}`}>
      <button aria-pressed={focusedId === note.id} onClick={() => onFocus(note.id)} className="mr-2 rounded border border-white/25 px-2 py-1">Focus #{note.id + 1}</button>
      <label><input type="checkbox" checked={accepted.includes(note.id)} onChange={(event) => onAccept(note.id, event.target.checked)} /> {note.sourceLabel ?? note.instrument}, x={note.x}, {note.shape}; shape strength {Math.round(note.strength * 100)}%, stem {note.stemHint ? 'possible' : 'unknown'}, flags {note.flagHint ? 'possible' : 'unknown'}; value {hints[note.id]?.value ?? 'unknown'} (possible), beams {hints[note.id]?.beamBands ?? 0}</label>
      <select aria-label={`Map candidate ${note.id}`} value={note.instrument} onChange={(event) => onMap(note.id, event.target.value as NoteCandidate['instrument'])} className="ml-2 rounded bg-zinc-900 p-1">{CHART_INSTRUMENTS.map((instrument) => <option key={instrument}>{instrument}</option>)}</select>
    </div>) : <p className="text-sm">No candidates. Adjust the crop or staff geometry; no notes will be invented.</p>}</div>
  </section>
}
