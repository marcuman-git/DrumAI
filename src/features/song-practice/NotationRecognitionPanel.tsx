import { useRef, useState } from 'react'
import { analyzeStaffs, candidatesToBar, findBarlineHints, findNoteCandidates } from './notationRecognition'
import type { NoteCandidate, RecognitionDraft, RecognitionImage, StaffCandidate } from './notationRecognition'
import { CHART_INSTRUMENTS } from './songChartLogic'
import type { ChartBar } from './songChartLogic'
export function NotationRecognitionPanel({ pixels, width, height, source, page, onDraft }: { pixels: Uint8ClampedArray; width: number; height: number; source: string; page: number; onDraft?: (draft: RecognitionDraft) => void }) {
  const canvas = useRef<HTMLCanvasElement | null>(null)
  const [image, setImage] = useState<RecognitionImage | null>(null)
  const [staff, setStaff] = useState<StaffCandidate | null>(null)
  const [staffIndex, setStaffIndex] = useState(0)
  const [notes, setNotes] = useState<NoteCandidate[]>([])
  const [accepted, setAccepted] = useState<number[]>([])
  const [threshold, setThreshold] = useState(160)
  const [angle, setAngle] = useState('')
  const [first, setFirst] = useState(10)
  const [last, setLast] = useState(95)
  const [confirmed, setConfirmed] = useState(false)
  const [draft, setDraft] = useState<ChartBar | null>(null)
  const [message, setMessage] = useState('Experimental: select exactly one bar. Standard instrument positions and evenly spaced 16 slots are required.')
  function draw(result: RecognitionImage, selected: StaffCandidate | null, candidates: NoteCandidate[]) {
    const target = canvas.current; if (!target) return
    target.width = width; target.height = height
    const ctx = target.getContext('2d'); if (!ctx) return
    const raster = ctx.createImageData(width, height); raster.data.set(pixels); ctx.putImageData(raster, 0, 0)
    const slope = Math.tan(result.angle * Math.PI / 180)
    if (selected) { ctx.strokeStyle = '#0891b2'; ctx.lineWidth = 1; for (let line = 0; line < 5; line++) { ctx.beginPath(); const y = selected.top + line * selected.gap; ctx.moveTo(0, y - slope * width / 2); ctx.lineTo(width, y + slope * width / 2); ctx.stroke() } }
    ctx.strokeStyle = '#d97706'; for (const note of candidates) { const y = note.y + slope * (note.x - width / 2); ctx.strokeRect(note.x - 6, y - 5, 12, 10) }
  }
  function chooseStaff(result: RecognitionImage, selected: StaffCandidate) {
    const candidates = findNoteCandidates(result, selected); setStaff(selected); setNotes(candidates); setAccepted([]); setDraft(null); setConfirmed(false); draw(result, selected, candidates)
  }
  function scan() {
    try {
      const result = analyzeStaffs(pixels, width, height, threshold, angle === '' ? null : Number(angle)); setImage(result); setStaffIndex(0)
      if (result.staffs[0]) { chooseStaff(result, result.staffs[0]); setMessage(`${result.staffs.length} possible staff(s), skew ${result.angle.toFixed(1)} degrees. Check overlays; false detections are possible.`) }
      else { setStaff(null); setNotes([]); setAccepted([]); setDraft(null); draw(result, null, []); setMessage('No reliable five-line staff found. Enter manual staff top and spacing, then rescan candidates, or use a clearer crop.') }
    } catch { setMessage('This crop could not be analyzed. Select a smaller, clearer notation region.') }
  }
  return <section className="space-y-3 rounded-lg border border-amber-200/40 bg-amber-950/15 p-3" aria-label="Experimental notation recognition">
    <h4 className="font-semibold">Experimental Region-to-Chart Prototype</h4>
    <p className="text-sm text-amber-100">Not production transcription. Candidates can be wrong. Only one evenly spaced 4/4 bar with Hi-hat above the staff, Snare upper space and Kick lower space is supported. Empty slots become guessed rests. Tuplets, variable spacing, flams, drags, ties, repeats, ghost notes and accents are not automatically interpreted.</p>
    <div className="grid gap-2 sm:grid-cols-2"><label className="text-sm">Ink threshold {threshold}<input aria-label="Recognition threshold" type="range" min={40} max={230} value={threshold} onChange={(event) => { setThreshold(Number(event.target.value)); setImage(null); setNotes([]); setAccepted([]); setConfirmed(false); setDraft(null) }} className="block w-full" /></label><label className="text-sm">Skew angle (blank = auto)<input aria-label="Recognition skew" type="number" min={-5} max={5} step={0.5} value={angle} onChange={(event) => { if (event.target.value === '' || (Number(event.target.value) >= -5 && Number(event.target.value) <= 5)) { setAngle(event.target.value); setImage(null); setNotes([]); setAccepted([]); setConfirmed(false); setDraft(null) } }} className="block w-full rounded border border-white/25 bg-zinc-900 p-2" /></label></div>
    <button onClick={scan} className="rounded border border-cyan-200/40 px-3 py-2">Detect staffs and note candidates</button>
    <p className="text-xs text-zinc-300">Crop: {width} x {height} pixels. Candidate x positions use this crop. Green guides mark your first/last slot centers, not automatically detected bar boundaries.</p>
    <div className="relative"><canvas ref={canvas} aria-label="Recognition candidate overlay" className="block h-auto w-full rounded bg-white" /><div className="pointer-events-none absolute inset-y-0 border-l-2 border-dashed border-emerald-500" style={{ left: first + '%' }} /><div className="pointer-events-none absolute inset-y-0 border-l-2 border-dashed border-emerald-500" style={{ left: last + '%' }} /></div>
    {image && <>
      {image.staffs.length > 0 && <label className="block text-sm">Detected staff<select aria-label="Detected staff" value={staffIndex} onChange={(event) => { const index = Number(event.target.value); setStaffIndex(index); chooseStaff(image, image.staffs[index]) }} className="block w-full rounded border border-white/25 bg-zinc-900 p-2">{image.staffs.map((_, index) => <option key={index} value={index}>Staff {index + 1}</option>)}</select></label>}
      <div className="grid gap-2 sm:grid-cols-2"><label className="text-sm">Staff top (crop pixels)<input aria-label="Manual staff top" type="number" min={0} max={height - 1} value={staff?.top ?? Math.round(height / 3)} onChange={(event) => { const top = Number(event.target.value); if (top >= 0 && top < height) { setStaff({ top, gap: staff?.gap ?? 10 }); setAccepted([]); setConfirmed(false); setDraft(null) } }} className="block w-full rounded border border-white/25 bg-zinc-900 p-2" /></label><label className="text-sm">Line spacing (pixels)<input aria-label="Manual staff spacing" type="number" min={4} max={80} value={staff?.gap ?? 10} onChange={(event) => { const gap = Number(event.target.value); if (gap >= 4 && gap <= 80) { setStaff({ top: staff?.top ?? Math.round(height / 3), gap }); setAccepted([]); setConfirmed(false); setDraft(null) } }} className="block w-full rounded border border-white/25 bg-zinc-900 p-2" /></label></div>
      <button onClick={() => { chooseStaff(image, staff ?? { top: Math.round(height / 3), gap: 10 }); setMessage('Candidates refreshed using manual staff geometry. Check every candidate.') }} className="rounded border border-white/25 px-3 py-2">Rescan with manual staff</button>
      {staff && <p className="text-xs text-zinc-300">Barline hints: {findBarlineHints(image, staff).length}. Stem/flag hints are diagnostic only; durations and rest symbols are not recognized. Candidate strength is not a probability of correctness.</p>}
      <div className="max-h-56 overflow-y-auto rounded border border-white/20 p-2">{notes.length ? notes.map((note) => <label key={note.id} className="block text-xs"><input type="checkbox" checked={accepted.includes(note.id)} onChange={(event) => { setAccepted((values) => event.target.checked ? [...values, note.id] : values.filter((id) => id !== note.id)); setDraft(null) }} /> {note.instrument}, x={note.x}, {note.shape}; shape strength {Math.round(note.strength * 100)}%, stem {note.stemHint ? 'possible' : 'unknown'}, flags {note.flagHint ? 'possible' : 'unknown'}</label>) : <p className="text-sm">No candidates. Adjust the crop or staff geometry; no notes will be invented.</p>}</div>
      <div className="grid gap-2 sm:grid-cols-2">{(['first', 'last'] as const).map((key) => <label key={key} className="text-sm">{key === 'first' ? 'Slot 1 center' : 'Slot 16 center'} (% of crop width)<input aria-label={key === 'first' ? 'First slot center' : 'Last slot center'} type="number" min={0} max={100} value={key === 'first' ? first : last} onChange={(event) => { const value = Number(event.target.value); if (value >= 0 && value <= 100) { if (key === 'first') setFirst(value); else setLast(value); setConfirmed(false); setDraft(null) } }} className="block w-full rounded border border-white/25 bg-zinc-900 p-2" /></label>)}</div>
      <label className="block text-sm"><input type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} /> I checked the candidates, instrument positions, slot centers and the single evenly spaced 4/4 bar assumption.</label>
      <button disabled={!confirmed || !accepted.length || last <= first} onClick={() => { const bar = candidatesToBar(notes.filter((note) => accepted.includes(note.id)), width * first / 100, width * last / 100); if (!CHART_INSTRUMENTS.some((instrument) => bar[instrument].some(Boolean))) { setMessage('No accepted candidates align with the slot centers. Correct the boundaries; no draft was created.'); return } setDraft(bar); setMessage('Draft preview only. Correct any cells below, then send it to the editor. Existing bars are unchanged.') }} className="rounded border border-amber-200/40 px-3 py-2 disabled:opacity-40">Build draft preview</button>
    </>}
    {draft && <><div className="overflow-x-auto"><div className="min-w-[500px] space-y-2">{CHART_INSTRUMENTS.map((instrument) => <div key={instrument} className="grid grid-cols-[70px_repeat(16,minmax(0,1fr))] gap-1"><span className="text-xs">{instrument}</span>{draft[instrument].map((note, step) => <button key={step} aria-label={`Draft ${instrument} slot ${step + 1}`} onClick={() => setDraft((current) => current ? { ...current, [instrument]: current[instrument].map((value, index) => index === step ? [0, 2, 1, 3][([0, 2, 1, 3].indexOf(value) + 1) % 4] : value) } : null)} className={`rounded border py-2 text-xs ${note ? 'border-cyan-200/40 bg-cyan-700/40' : 'border-white/25'}`}>{['-', '(x)', 'x', '>x'][note]}</button>)}</div>)}</div></div><button disabled={!onDraft || !confirmed} onClick={() => { onDraft?.({ bar: structuredClone(draft), source, page }); setMessage('Draft sent to editor. Use Add detected bar there to append it; existing bars are preserved.') }} className="rounded bg-cyan-800 px-3 py-2 disabled:opacity-40">Send draft to chart editor</button></>}
    <p role="status" className="text-sm text-cyan-100">{message}</p>
  </section>
}
