import { percussionClefHint } from './notationSymbols'
import { CandidateNavigator } from './CandidateNavigator'
import { alignedCandidates, selectedCandidates } from './candidateSelection'
import { ReviewedNotationPanel } from './ReviewedNotationPanel'
import { RhythmReview } from './RhythmReview'
import { useEffect, useMemo, useRef, useState } from 'react'
import { analyzeStaffs, candidatesToBar, findBarlineHints, findNoteCandidates, interiorBarlines } from './notationRecognition'
import type { NoteCandidate, RecognitionDraft, RecognitionImage, RecognitionProfile, RecognitionOptions, StaffCandidate } from './notationRecognition'
import { CHART_INSTRUMENTS, notesFor } from './songChartLogic'
import type { ChartBar } from './songChartLogic'
import { inspectNoteValue } from './noteValueHints'
import type { NoteValueHint } from './noteValueHints'
import { DRUM_KEY_REFERENCE } from './drumKeyReference'
export function NotationRecognitionPanel({ pixels, width, height, source, page, onDraft }: { pixels: Uint8ClampedArray; width: number; height: number; source: string; page: number; onDraft?: (draft: RecognitionDraft) => void }) {
  const canvas = useRef<HTMLCanvasElement | null>(null)
  const analysisCache = useRef<{ pixels: Uint8ClampedArray; width: number; height: number; threshold: number; angle: string; result: RecognitionImage } | null>(null)
  const [cleanHeads, setCleanHeads] = useState(true)
  const [sourceCalibration, setSourceCalibration] = useState(false)
  const [kickOffset, setKickOffset] = useState(4.5)
  const [snareOffset, setSnareOffset] = useState(1.5)
  const [floorCalibration, setFloorCalibration] = useState(false)
  const [floorOne, setFloorOne] = useState(2.5)
  const [floorTwo, setFloorTwo] = useState(3)
  const [headScale, setHeadScale] = useState(1)
  const [headTolerance, setHeadTolerance] = useState(2)
  const [excludeClef, setExcludeClef] = useState(true)
  const [focusedId, setFocusedId] = useState<number | null>(null)
  const [showNumbers, setShowNumbers] = useState(true)
  const [elapsed, setElapsed] = useState<number | null>(null)
  const [reused, setReused] = useState(false)
  const [image, setImage] = useState<RecognitionImage | null>(null)
  const [staff, setStaff] = useState<StaffCandidate | null>(null)
  const [staffIndex, setStaffIndex] = useState(0)
  const [notes, setNotes] = useState<NoteCandidate[]>([])
  const [valueHints, setValueHints] = useState<Record<number, NoteValueHint>>({})
  const [manualStaff, setManualStaff] = useState(false)
  const [scanCount, setScanCount] = useState(0)
  const [profile, setProfile] = useState<RecognitionProfile>('generic')
  const [accepted, setAccepted] = useState<number[]>([])
  const [threshold, setThreshold] = useState(160)
  const [angle, setAngle] = useState('')
  const [first, setFirst] = useState(10)
  const [last, setLast] = useState(95)
  const [confirmed, setConfirmed] = useState(false)
  const [draft, setDraft] = useState<ChartBar | null>(null)
  const [message, setMessage] = useState('Experimental: select exactly one bar. Instrument suggestions need checking; evenly spaced 16 slots are required.')
  const checkedNotes = selectedCandidates(notes, accepted)
  const alignedNotes = alignedCandidates(checkedNotes, width * first / 100, width * last / 100)
  const clefHint = useMemo(() => image && staff ? percussionClefHint(image, staff) : null, [image, staff])
  const internalLines = useMemo(() => image && staff ? interiorBarlines(image, staff, width * first / 100, width * last / 100) : [], [image, staff, width, first, last])
  const multiBar = internalLines.length >= 2
  const barlineCount = useMemo(() => image && staff ? findBarlineHints(image, staff).length : 0, [image, staff])
  useEffect(() => {
    setFocusedId(null)
    analysisCache.current = null
    setImage(null); setStaff(null); setStaffIndex(0); setNotes([]); setAccepted([]); setDraft(null); setConfirmed(false); setElapsed(null); setReused(false)
    setMessage('New crop ready. Detect candidates and check them before building a draft.')
    setValueHints({}); setManualStaff(false); setScanCount(0)
    if (canvas.current) { canvas.current.width = width; canvas.current.height = height }
  }, [pixels, width, height, source, page])
  function draw(result: RecognitionImage, selected: StaffCandidate | null, candidates: NoteCandidate[], hints: Record<number, NoteValueHint> = {}) {
    const target = canvas.current; if (!target) return
    target.width = width; target.height = height
    const ctx = target.getContext('2d'); if (!ctx) return
    const raster = ctx.createImageData(width, height); raster.data.set(pixels); ctx.putImageData(raster, 0, 0)
    const slope = Math.tan(result.angle * Math.PI / 180)
    if (selected) { ctx.strokeStyle = '#0891b2'; ctx.lineWidth = 1; for (let line = 0; line < 5; line++) { ctx.beginPath(); const y = selected.top + line * selected.gap; ctx.moveTo(0, y - slope * width / 2); ctx.lineTo(width, y + slope * width / 2); ctx.stroke() } }
    for (const note of candidates) {
      const hint = hints[note.id]
      if (hint) { ctx.strokeStyle = '#0891b2'; ctx.setLineDash?.([3, 3]); ctx.strokeRect(hint.left, hint.top + slope * (note.x - width / 2), hint.width, hint.height); ctx.setLineDash?.([]) }
      ctx.strokeStyle = '#d97706'; const y = note.y + slope * (note.x - width / 2); ctx.strokeRect(note.x - 6, y - 5, 12, 10)
    }
  }
  function chooseStaff(result: RecognitionImage, selected: StaffCandidate, omitClef = excludeClef, calibration: RecognitionOptions = { cleanHeads, headScale, tolerance: profile === 'generic' && !floorCalibration && !sourceCalibration ? 0 : headTolerance, ...(sourceCalibration ? { kick: kickOffset, snare: snareOffset } : {}), ...(floorCalibration ? { floorTom1: floorOne, floorTom2: floorTwo } : {}) }) {
    const clef = omitClef ? percussionClefHint(result, selected) : null
    const candidates = findNoteCandidates(result, selected, profile, calibration).filter((note) => !clef || note.x < clef.left || note.x > clef.right)
    const hints = Object.fromEntries(candidates.map((note) => [note.id, inspectNoteValue(result, selected, note)]))
    setFocusedId(null); setValueHints(hints); setStaff(selected); setNotes(candidates); setAccepted([]); setDraft(null); setConfirmed(false); draw(result, selected, candidates, hints)
  }
  function scan(force = false) {
    const started = performance.now()
    try {
      const cached = analysisCache.current
      const useCache = !force && !!cached && cached.pixels === pixels && cached.width === width && cached.height === height && cached.threshold === threshold && cached.angle === angle
      const result = useCache ? cached.result : analyzeStaffs(pixels, width, height, threshold, angle === '' ? null : Number(angle))
      analysisCache.current = { pixels, width, height, threshold, angle, result }
      const selectedIndex = Math.max(0, Math.min(staffIndex, result.staffs.length - 1))
      setReused(useCache); setImage(result); setStaffIndex(selectedIndex)
      const selected = manualStaff && staff ? staff : result.staffs[selectedIndex]
      if (selected) { chooseStaff(result, selected); setMessage(`Candidates refreshed${force ? ' with fresh pixel analysis' : ''}${manualStaff ? ' using your manual staff' : ''}. ${result.staffs.length} possible staff(s), skew ${result.angle.toFixed(1)} degrees. Check overlays; false detections are possible.`) }
      else { setStaff(null); setNotes([]); setAccepted([]); setDraft(null); draw(result, null, []); setMessage('No reliable five-line staff found. Enter manual staff top and spacing, then rescan candidates, or use a clearer crop.') }
      setElapsed(performance.now() - started)
      setScanCount((count) => count + 1)
    } catch { setElapsed(null); setMessage('This crop could not be analyzed. Select a smaller, clearer notation region.') }
  }
  function rescanManual() {
    if (!image) return
    const started = performance.now()
    setManualStaff(true); chooseStaff(image, staff ?? { top: Math.round(height / 3), gap: 10 })
    setScanCount((count) => count + 1); setReused(true); setElapsed(performance.now() - started)
    setMessage('Candidates refreshed using manual staff geometry. Check every candidate.')
  }
  return <section className="space-y-3 rounded-lg border border-amber-200/40 bg-amber-950/15 p-3" aria-label="Experimental notation recognition">
    <h4 className="font-semibold">Experimental Region-to-Chart Prototype</h4>
    <label className="block text-sm">Instrument-position profile<select aria-label="Recognition instrument profile" value={profile} onChange={(event) => { setProfile(event.target.value as RecognitionProfile); setNotes([]); setValueHints({}); setAccepted([]); setDraft(null); setConfirmed(false); setMessage('Profile changed. Detect again; existing chart notes are unchanged.') }} className="mt-1 block w-full rounded border border-white/25 bg-zinc-900 p-2"><option value="generic">Generic positions (verify mapping)</option><option value="master-key">Supplied Master Drum Key</option><option value="guide-kit">Supplied beginner notation guides</option></select></label>
    <p className="text-xs text-amber-100">Use Master Drum Key only when the source follows that legend. It suggests tom, bass and pedal-hi-hat rows, not guaranteed identities. Splash/China/second crash and articulations still require interpretation.</p>
    <p className="text-sm text-amber-100">Include space above and below the staff in your crop. Generic-profile crosses start with a Hi-hat suggestion; the Master Drum Key profile suggests cymbal and pedal voices by position. Verify every instrument against your chart legend. Clefs are structural symbols, not strokes; exclude them from accepted candidates.</p>
    <p className="text-sm text-amber-100">Not production transcription. Candidates can be wrong. Only one evenly spaced 4/4 bar with heads inside and below the staff is supported. Empty slots become guessed rests. Tuplets, variable spacing, flams, drags, ties, repeats, ghost notes and accents are not automatically interpreted.</p>
    <div className="grid gap-2 sm:grid-cols-2"><label className="text-sm">Ink threshold {threshold}<input aria-label="Recognition threshold" type="range" min={40} max={230} value={threshold} onChange={(event) => { setThreshold(Number(event.target.value)); setImage(null); setNotes([]); setAccepted([]); setConfirmed(false); setDraft(null) }} className="block w-full" /></label><label className="text-sm">Skew angle (blank = auto)<input aria-label="Recognition skew" type="number" min={-5} max={5} step={0.5} value={angle} onChange={(event) => { if (event.target.value === '' || (Number(event.target.value) >= -5 && Number(event.target.value) <= 5)) { setAngle(event.target.value); setImage(null); setNotes([]); setAccepted([]); setConfirmed(false); setDraft(null) } }} className="block w-full rounded border border-white/25 bg-zinc-900 p-2" /></label></div>
    <fieldset className="space-y-2 rounded border border-cyan-300/30 p-3"><legend className="text-sm font-semibold">Floor-tom calibration</legend>
      <label className="block text-sm"><input type="checkbox" checked={floorCalibration} onChange={(event) => { setFloorCalibration(event.target.checked); setNotes([]); setAccepted([]); setDraft(null); setConfirmed(false); setMessage('Calibration changed. Detect again with the source staff positions.') }} /> Use calibrated floor-tom positions</label>
      <div className="grid gap-2 sm:grid-cols-2">{([1, 2] as const).map((number) => <label key={number} className="text-sm">Floor tom {number} staff offset<input aria-label={`Floor tom ${number} staff offset`} type="number" min={-1} max={6} step={0.5} value={number === 1 ? floorOne : floorTwo} onChange={(event) => { const value = Number(event.target.value); if (value >= -1 && value <= 6) { if (number === 1) setFloorOne(value); else setFloorTwo(value); setNotes([]); setAccepted([]); setDraft(null); setConfirmed(false) } }} className="ml-2 w-20 rounded bg-zinc-900 p-2" /></label>)}</div>
      <label className="block text-sm">Head-position tolerance {headTolerance} px<input aria-label="Head-position tolerance" type="range" min={0} max={4} value={headTolerance} onChange={(event) => { setHeadTolerance(Number(event.target.value)); setNotes([]); setAccepted([]); setDraft(null); setConfirmed(false) }} className="block w-full" /></label>
      <label className="block text-sm"><input type="checkbox" checked={cleanHeads} onChange={(event) => { setCleanHeads(event.target.checked); setNotes([]); setAccepted([]); setDraft(null); setConfirmed(false) }} /> Reduce beam/stem candidates</label>
      <p className="text-xs text-amber-100">Uses head compactness and suppresses wide beam rows. It can remove a real crowded head; disable to compare and rescan.</p>
      <label className="block text-sm">Notehead size {Math.round(headScale * 100)}%<input aria-label="Notehead size" type="range" min={60} max={140} step={5} value={Math.round(headScale * 100)} onChange={(event) => { setHeadScale(Number(event.target.value) / 100); setNotes([]); setAccepted([]); setDraft(null); setConfirmed(false) }} className="block w-full" /></label>
      <p className="text-xs text-amber-100">Use 100% first. If filled heads are smaller than the detector boxes, try 60-80%; larger values fit wider heads. Smaller templates may mistake stems or text for notes. Rescan and verify.</p>
      <p className="text-xs text-amber-100">Offsets count line spacings down from the top: 2.5 is between lines 3 and 4; 3 is line 4. Match the chart legend. Calibration replaces other suggestions at those positions. Tolerance can help displaced heads but add false detections. Generic mode stays strict unless calibration is enabled. Detect again after changes.</p>
    </fieldset>
    <fieldset className="space-y-2 rounded border border-cyan-300/30 p-3"><legend className="text-sm font-semibold">Source snare/kick calibration</legend>
      <label className="block text-sm"><input type="checkbox" checked={sourceCalibration} onChange={(event) => { setSourceCalibration(event.target.checked); setNotes([]); setAccepted([]); setDraft(null); setConfirmed(false) }} /> Use source snare/kick positions</label>
      <div className="grid gap-2 sm:grid-cols-2">{(['Kick', 'Snare'] as const).map((name) => <label key={name} className="text-sm">{name} staff offset<input aria-label={`${name} staff offset`} type="number" min={-1} max={6} step={0.5} value={name === 'Kick' ? kickOffset : snareOffset} onChange={(event) => { const value = Number(event.target.value); if (value >= -1 && value <= 6) { if (name === 'Kick') setKickOffset(value); else setSnareOffset(value); setNotes([]); setAccepted([]); setDraft(null); setConfirmed(false) } }} className="ml-2 w-20 rounded bg-zinc-900 p-2" /></label>)}</div>
      <p className="text-xs text-amber-100">For the supplied feedback bar, Kick is 4.5 (below the bottom staff line) and Snare is 1.5. Use these only if your chart matches. Cross-shaped pedal notes remain separate. Detect again after changing calibration.</p>
    </fieldset>

    <div className="flex flex-wrap gap-2"><button onClick={() => scan()} className="rounded border border-cyan-200/40 px-3 py-2">Detect staffs and note candidates</button><button onClick={() => scan(true)} className="rounded border border-white/25 px-3 py-2">Run fresh detection</button></div>
    <p className="text-xs text-zinc-300">Completed scans: {scanCount}. Repeated detection retains edited staff geometry; fresh detection bypasses the pixel cache. Identical input may correctly produce identical boxes.</p>
    <p className="text-xs text-amber-100">Dashed blue boxes inspect wider stem/beam context. Quarter/eighth/sixteenth labels are possible values, not confirmed rhythm transcription. Flags, ties, dots and overlapping voices can mislead these hints; draft timing still uses your slot-center guides.</p>
    {elapsed !== null && <p className="text-xs text-zinc-300">Last scan: {Math.round(elapsed)} ms{reused ? ' (staff analysis reused)' : ''}. This is processing time, not recognition accuracy. Changing the crop, threshold or skew triggers fresh staff analysis.</p>}
    <p className="text-xs text-zinc-300">Crop: {width} x {height} pixels. Candidate x positions use this crop. Green guides mark your first/last slot centers, not automatically detected bar boundaries.</p>
    <label className="block text-sm"><input type="checkbox" checked={showNumbers} onChange={(event) => setShowNumbers(event.target.checked)} /> Show candidate numbers</label>
    <p className="text-xs text-zinc-300">Overlay numbers: amber unchecked, green checked, cyan focused. Click a number to locate its row without checking it.</p>
    <div className="relative"><canvas ref={canvas} aria-label="Recognition candidate overlay" className="block h-auto w-full rounded bg-white" />
      {image && showNumbers && notes.map((note) => {
        const y = note.y + Math.tan(image.angle * Math.PI / 180) * (note.x - width / 2)
        return <button key={note.id} aria-label={`Locate candidate ${note.id + 1}`} aria-pressed={focusedId === note.id} onClick={() => setFocusedId(note.id)} style={{ left: `${Math.max(0, Math.min(97, note.x / width * 100))}%`, top: `${Math.max(0, Math.min(92, (y - 8) / height * 100))}%` }} className={`absolute z-10 rounded border px-1 text-xs font-bold shadow ${focusedId === note.id ? 'border-cyan-100 bg-cyan-800 text-white' : accepted.includes(note.id) ? 'border-emerald-200 bg-emerald-900 text-white' : 'border-amber-200 bg-amber-950 text-amber-100'}`}>#{note.id + 1}</button>
      })}
      <div className="pointer-events-none absolute inset-y-0 border-l-2 border-dashed border-emerald-500" style={{ left: first + '%' }} /><div className="pointer-events-none absolute inset-y-0 border-l-2 border-dashed border-emerald-500" style={{ left: last + '%' }} />
    </div>
    {image && <>
      {image.staffs.length > 0 && <label className="block text-sm">Detected staff<select aria-label="Detected staff" value={staffIndex} onChange={(event) => { const index = Number(event.target.value); setStaffIndex(index); setManualStaff(false); chooseStaff(image, image.staffs[index]) }} className="block w-full rounded border border-white/25 bg-zinc-900 p-2">{image.staffs.map((_, index) => <option key={index} value={index}>Staff {index + 1}</option>)}</select></label>}
      <div className="grid gap-2 sm:grid-cols-2"><label className="text-sm">Staff top (crop pixels)<input aria-label="Manual staff top" type="number" min={0} max={height - 1} value={staff?.top ?? Math.round(height / 3)} onChange={(event) => { const top = Number(event.target.value); if (top >= 0 && top < height) { setNotes([]); setValueHints({}); setManualStaff(true); setStaff({ top, gap: staff?.gap ?? 10 }); setAccepted([]); setConfirmed(false); setDraft(null) } }} className="block w-full rounded border border-white/25 bg-zinc-900 p-2" /></label><label className="text-sm">Line spacing (pixels)<input aria-label="Manual staff spacing" type="number" min={4} max={80} value={staff?.gap ?? 10} onChange={(event) => { const gap = Number(event.target.value); if (gap >= 4 && gap <= 80) { setNotes([]); setValueHints({}); setManualStaff(true); setStaff({ top: staff?.top ?? Math.round(height / 3), gap }); setAccepted([]); setConfirmed(false); setDraft(null) } }} className="block w-full rounded border border-white/25 bg-zinc-900 p-2" /></label></div>
      <button onClick={rescanManual} className="rounded border border-white/25 px-3 py-2">Rescan with manual staff</button>
      {staff && <p className="text-xs text-zinc-300">Barline hints: {barlineCount}. Stem/beam hints are diagnostic only; durations are not automatically assigned and rest symbols are not recognized. Candidate strength is not a probability of correctness.</p>}
      <label className="block text-sm"><input type="checkbox" checked={excludeClef} onChange={(event) => { setExcludeClef(event.target.checked); if (image && staff) chooseStaff(image, staff, event.target.checked) }} /> Exclude suspected percussion clef</label>
      <p className="text-xs text-amber-100">{clefHint ? `Possible two-bar percussion clef near crop x=${clefHint.left}-${clefHint.right}. Verify before excluding; disable if it hides a real note.` : 'No reliable two-bar percussion clef hint. Other clefs still require manual rejection.'}</p>
      <p className="text-xs text-zinc-300">Floor tom mapping is available with Supplied Master Drum Key or Supplied beginner notation guides; generic positions are ambiguous. Use candidate instrument mapping to correct the source legend. Open-circle detection is tentative and font-dependent.</p>
      <div className="flex flex-wrap items-center gap-2"><button disabled={!notes.length} onClick={() => { setAccepted(notes.map((note) => note.id)); setDraft(null); setConfirmed(false) }} className="rounded border border-cyan-300/40 bg-cyan-900/30 px-3 py-2 disabled:opacity-40">Select all candidates</button><button disabled={!accepted.length} onClick={() => { setAccepted([]); setDraft(null); setConfirmed(false) }} className="rounded border border-white/25 px-3 py-2 disabled:opacity-40">Clear candidate selection</button><span className="text-xs text-zinc-300">Selected {checkedNotes.length} / {notes.length}. {checkedNotes.length - alignedNotes.length} cannot align to the current slot guides.</span></div>
      <p className="text-xs text-amber-100">Select all is a convenience, not verification. Uncheck false detections. Build draft preview uses only checked candidates that align to your slot guides.</p>
      <CandidateNavigator previewSource={{ pixels, width, height, angle: image.angle }} notes={notes} accepted={accepted} hints={valueHints} focusedId={focusedId} onFocus={setFocusedId} onAccept={(id, checked) => { setAccepted((values) => checked ? [...new Set([...values, id])] : values.filter((value) => value !== id)); setDraft(null); setConfirmed(false) }} onMap={(id, instrument) => { setNotes((values) => values.map((note) => note.id === id ? { ...note, instrument } : note)); setDraft(null); setConfirmed(false) }} />
      <div className="grid gap-2 sm:grid-cols-2">{(['first', 'last'] as const).map((key) => <label key={key} className="text-sm">{key === 'first' ? 'Slot 1 center' : 'Slot 16 center'} (% of crop width)<input aria-label={key === 'first' ? 'First slot center' : 'Last slot center'} type="number" min={0} max={100} value={key === 'first' ? first : last} onChange={(event) => { const value = Number(event.target.value); if (value >= 0 && value <= 100) { if (key === 'first') setFirst(value); else setLast(value); setConfirmed(false); setDraft(null) } }} className="block w-full rounded border border-white/25 bg-zinc-900 p-2" /></label>)}</div>
      {multiBar ? <p role="alert" className="rounded border border-amber-300/50 p-3 text-sm text-amber-100">Multiple barline hints inside the slot guides. Crop exactly one bar, or move the guides within one bar, then verify. Multi-bar PDF transcription is not supported; draft building is blocked to avoid compressing several bars into sixteen slots.</p> : <ReviewedNotationPanel key={JSON.stringify([source, page, staff, profile, notes, accepted, first, last])} notes={checkedNotes} hints={valueHints} first={width * first / 100} last={width * last / 100} image={image} staff={staff} onInvalidate={() => { setDraft(null); setConfirmed(false) }} onConfirm={(bar) => { setDraft(bar); setConfirmed(true); setMessage('Duration-reviewed draft ready. Send explicitly to the chart editor.') }} />}
      <RhythmReview notes={checkedNotes} hints={valueHints} first={width * first / 100} last={width * last / 100} />
      <label className="block text-sm"><input type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} /> I checked the candidates, instrument positions, slot centers and the single evenly spaced 4/4 bar assumption.</label>
      <button disabled={multiBar || !confirmed || !accepted.length || last <= first} onClick={() => { const bar = candidatesToBar(alignedNotes, width * first / 100, width * last / 100); if (!CHART_INSTRUMENTS.some((instrument) => notesFor(bar, instrument).some(Boolean))) { setMessage('No accepted candidates align with the slot centers. Correct the boundaries; no draft was created.'); return } setDraft(bar); setMessage(`Draft preview from ${alignedNotes.length} checked, aligned candidates. ${checkedNotes.length - alignedNotes.length} checked candidates excluded by slot alignment. Unchecked candidates are excluded. Existing bars are unchanged.`) }} className="rounded border border-amber-200/40 px-3 py-2 disabled:opacity-40">Build draft preview</button>
    </>}
    {draft && <><div className="overflow-x-auto"><div className="min-w-[500px] space-y-2">{CHART_INSTRUMENTS.map((instrument) => <div key={instrument} className="grid grid-cols-[70px_repeat(16,minmax(0,1fr))] gap-1"><span className="text-xs">{instrument}</span>{notesFor(draft, instrument).map((note, step) => <button key={step} aria-label={`Draft ${instrument} slot ${step + 1}`} onClick={() => setDraft((current) => current ? { ...current, rhythmEvents: undefined, [instrument]: notesFor(current, instrument).map((value, index) => index === step ? [0, 2, 1, 3][([0, 2, 1, 3].indexOf(value) + 1) % 4] : value) } : null)} className={`rounded border py-2 text-xs ${note ? 'border-cyan-200/40 bg-cyan-700/40' : 'border-white/25'}`}>{['-', '(x)', 'x', '>x'][note]}</button>)}</div>)}</div></div><button disabled={!onDraft || !confirmed} onClick={() => { onDraft?.({ bar: structuredClone(draft), source, page }); setMessage('Draft sent to editor. Use Add detected bar there to append it; existing bars are preserved.') }} className="rounded bg-cyan-800 px-3 py-2 disabled:opacity-40">Send draft to chart editor</button></>}
    <p role="status" className="text-sm text-cyan-100">{message}</p>
    <details className="rounded border border-white/20 p-2"><summary className="cursor-pointer text-sm">Drum key reference and support</summary><p className="mt-2 text-xs text-zinc-300">Based on your Master Drum Key. Positions vary between publishers; a glyph is not a guaranteed instrument identity.</p>{DRUM_KEY_REFERENCE.map((group) => <div key={group.group} className="mt-2 text-xs"><strong>{group.group}: </strong>{group.items}<p className="text-amber-100">{group.status}</p></div>)}</details>
  </section>
}
