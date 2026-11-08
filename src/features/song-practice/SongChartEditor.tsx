import type { RecognitionDraft } from './notationRecognition'
import { normalizeReview } from './chartReviewLogic'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { GlassCard } from '../../shared/components/GlassCard'
import { createGroovePlayer } from '../groove-library/grooveAudio'
import { startPracticeSession, stopPracticeSession, trackPracticeEvent } from '../../core/services/storage/practiceEvents'
import { blankBar, chartSection, CHART_INSTRUMENTS, notesFor, cycleChartNote, loadSongCharts, isSongChart, parseSongChart, saveSongCharts } from './songChartLogic'
import type { SongChart } from './songChartLogic'
import { ChartStaffNotation } from './ChartStaffNotation'
import { ChartPracticeControls } from './ChartPracticeControls'
import { defaultMix, defaultTraining, ladderBpm, mixLevel } from './chartPracticeSettings'
import { useChartHistory } from './useChartHistory'
import { MusicXmlImportPanel } from './MusicXmlImportPanel'

export function SongChartEditor({ recognitionDraft, onDraftConsumed }: { recognitionDraft?: RecognitionDraft | null; onDraftConsumed?: () => void } = {}) {
  const { chart, setChart, resetChart, canUndo, canRedo, undo, redo } = useChartHistory()
  const [visible, setVisible] = useState<readonly typeof CHART_INSTRUMENTS[number][]>(() => {
    try { const stored = JSON.parse(localStorage.getItem('drummaster-visible-chart-instruments') ?? 'null'); if (Array.isArray(stored)) return CHART_INSTRUMENTS.filter((name) => stored.includes(name)) } catch { /* Use all rows when preferences cannot be read. */ }
    return CHART_INSTRUMENTS
  })
  const changeVisible = (values: readonly typeof CHART_INSTRUMENTS[number][]) => { setVisible(values); try { localStorage.setItem('drummaster-visible-chart-instruments', JSON.stringify(values)) } catch { /* Visibility still works for this visit. */ } }
  const [confirmClear, setConfirmClear] = useState(false)
  const [cycles, setCycles] = useState(0)
  const [search, setSearch] = useState('')
  const [saved, setSaved] = useState(loadSongCharts)
  const [selectedSave, setSelectedSave] = useState('')
  const [storedBar, setSelectedBar] = useState(0)
  const selectedBar = Math.min(storedBar, chart.bars.length - 1)
  const [playing, setPlaying] = useState(false)
  const [countBeat, setCountBeat] = useState<number | null>(null)
  const [active, setActive] = useState(-1)
  const [activeBar, setActiveBar] = useState(0)
  const [loop, setLoop] = useState(false)
  const [volume, setVolume] = useState(0.3)
  const [message, setMessage] = useState('Click cells to cycle: rest  to  note  to  ghost  to  accent  to  rest. Each bar is 4/4 with sixteen slots.')
  const generation = useRef(0)
  const owned = useRef<{ context: AudioContext; timer: number; frame: number; session: string | null; bars: number; cycleBars: number } | null>(null)
  const config = useRef({ chart, loop, volume })
  useLayoutEffect(() => { config.current = { chart, loop, volume } }, [chart, loop, volume])
  const stop = (updateUI = true) => {
    generation.current += 1
    const resource = owned.current
    if (resource) {
      window.clearInterval(resource.timer); cancelAnimationFrame(resource.frame)
      if (resource.session) stopPracticeSession('song-practice', resource.session, { source: 'chart', completedBars: resource.bars, completedCycles: Math.floor(resource.bars / resource.cycleBars) })
      void resource.context.close(); owned.current = null
    }
    if (updateUI) { setPlaying(false); setCountBeat(null); setActive(-1) }
  }
  useEffect(() => {
    const onHidden = () => { if (document.hidden) { stop(); setMessage('Chart stopped because this tab was hidden. Session saved.') } }
    document.addEventListener('visibilitychange', onHidden)
    return () => { document.removeEventListener('visibilitychange', onHidden); stop(false) }
  }, [])
  const start = async () => {
    stop(); const token = generation.current
    setCycles(0); if ((chart.training ?? defaultTraining()).enabled) { setLoop(true); config.current.loop = true }
    setConfirmClear(false); setPlaying(true); setActiveBar(chartSection(chart).start); setMessage('Preparing chart audio...')
    let context: AudioContext | null = null
    try {
      context = new AudioContext(); await context.resume()
      if (token !== generation.current) { void context.close(); return }
      const audio = context; const play = createGroovePlayer(audio)
      const resource = { context: audio, timer: 0, frame: 0, session: null as string | null, bars: 0, cycleBars: chartSection(chart).end - chartSection(chart).start + 1 }
      owned.current = resource
      const section = chartSection(chart); const first = section.start * 16; const limit = (section.end + 1) * 16
      let index = first; let next = audio.currentTime + 0.04; let end: number | null = null
      const training = chart.training ?? defaultTraining(); let scheduledCycles = 0
      let remainingCount = chart.countIn ? 4 : 0; let countIndex = 0
      const visuals: { index: number; time: number; boundary: boolean; count?: number }[] = []
      const schedule = () => {
        if (token !== generation.current) return
        if (end !== null && config.current.loop && (!training.enabled || scheduledCycles < training.repetitions)) { end = null; index = first }
        while (end === null && next < audio.currentTime + 0.04) {
          let current = config.current
          if (remainingCount > 0) {
            const time = Math.max(next, audio.currentTime)
            const osc = audio.createOscillator(); const gain = audio.createGain()
            osc.type = 'sine'; osc.frequency.value = 980
            gain.gain.setValueAtTime(Math.max(0.0001, current.volume), time)
            gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.045)
            osc.connect(gain); gain.connect(audio.destination); osc.start(time); osc.stop(time + 0.05)
            visuals.push({ index: -1, time, boundary: false, count: countIndex + 1 })
            countIndex += 1; remainingCount -= 1; next = time + 60 / current.chart.bpm
            continue
          }
          if (index === limit) {
            scheduledCycles += 1
            if (!current.loop || (training.enabled && scheduledCycles >= training.repetitions)) { end = next; break }
            const bpm = ladderBpm(config.current.chart.bpm, training, scheduledCycles)
            if (bpm !== config.current.chart.bpm) { config.current.chart = { ...config.current.chart, bpm }; setChart((value) => ({ ...value, bpm })) }
            current = config.current
            index = first
          }
          const time = Math.max(next, audio.currentTime)
          const bar = current.chart.bars[Math.floor(index / 16)]
          for (const instrument of CHART_INSTRUMENTS) {
            const note = notesFor(bar, instrument)[index % 16]
            if (note) play(instrument, time, note === 1, current.volume * mixLevel(current.chart.mix ?? defaultMix(), instrument) * (note === 3 ? 1.35 : 0.8))
          }
          visuals.push({ index, time, boundary: false })
          next = time + 60 / current.chart.bpm / 4; index += 1
          if (index % 16 === 0) visuals.push({ index, time: next, boundary: true })
        }
      }
      const animate = () => {
        if (token !== generation.current) return
        while (visuals.length && visuals[0].time <= audio.currentTime) {
          const item = visuals.shift()!
          if (item.count !== undefined) { setCountBeat(item.count); continue }
          if (!resource.session) resource.session = startPracticeSession('song-practice', { source: 'chart', chartTitle: chart.title, bpm: config.current.chart.bpm, chartBars: chart.bars.length, sectionStart: section.start + 1, sectionEnd: section.end + 1 })
          setCountBeat(null)
          if (item.boundary) {
            resource.bars += 1
            setCycles(Math.floor(resource.bars / (section.end - section.start + 1)))
            void trackPracticeEvent('song-practice', 'score', { source: 'chart', completedBars: resource.bars, completedCycles: Math.floor(resource.bars / resource.cycleBars), bpm: config.current.chart.bpm, measuredTiming: false }, resource.session)
          } else { setActiveBar(Math.floor(item.index / 16)); setActive(item.index % 16) }
        }
        if (end !== null && audio.currentTime >= end) {
          if (config.current.loop && (!training.enabled || scheduledCycles < training.repetitions)) schedule()
          else { stop(); setMessage(training.enabled && scheduledCycles >= training.repetitions ? 'Repetition target completed. Session saved.' : 'Chart completed. Session saved.'); return }
        }
        resource.frame = requestAnimationFrame(animate)
      }
      schedule(); resource.timer = window.setInterval(schedule, 20); resource.frame = requestAnimationFrame(animate)
      setMessage((chart.countIn ?? 0) > 0 ? 'Count-in first, then the selected section. Keep counting through rests.' : 'Playing selected section. Tempo, volume, and note edits affect upcoming notes. Loop repeats the selected bars.')
    } catch {
      if (context && context.state !== 'closed') void context.close()
      if (token !== generation.current) return
      stop(); setMessage('Chart audio could not start. Check browser audio permissions and retry.')
    }
  }
  const persist = (update: boolean) => {
    try {
      const entry: SongChart = { ...normalizeReview(chart), id: update ? selectedSave : crypto.randomUUID(), title: chart.title.trim() }
      const next = update ? saved.map((item) => item.id === selectedSave ? entry : item) : [...saved, entry]
      saveSongCharts(next); setSaved(next); resetChart(entry); setSelectedSave(entry.id); setMessage(update ? 'Selected chart updated.' : 'New chart saved on this device.')
    } catch { setMessage('Could not save. Enter a title and check browser storage.') }
  }
  const importFile = async (file: File) => {
    try {
      if (file.size > 512 * 1024) throw new Error('Too large')
      const imported = parseSongChart(await file.text())
      stop(); resetChart(imported); setSelectedBar(0); setSelectedSave(''); setMessage('Chart imported into the editor. Save as new to retain it.')
    } catch { setMessage('Invalid chart JSON. Expected a DrumMaster AI Chart file, maximum 512 KB.') }
  }
  const shownBar = playing ? activeBar : Math.min(selectedBar, chart.bars.length - 1)
  return <div className="grid gap-3 lg:grid-cols-[2fr_1fr]">
    <GlassCard layout={false} className="min-w-0 space-y-3">
      <h3 className="text-lg font-semibold">Editable Drum Chart</h3>
      <MusicXmlImportPanel disabled={playing} onImport={(value) => { resetChart(value); setSelectedBar(0); setConfirmClear(false) }} />
      {recognitionDraft && <div role="alert" className="rounded border border-amber-200/50 bg-amber-950/25 p-3"><p>Experimental draft from {recognitionDraft.source}, page {recognitionDraft.page}. Check its notes; detection is not guaranteed.</p><div className="mt-2 flex gap-2"><button disabled={playing || chart.bars.length >= 16} onClick={() => { setChart((current) => ({ ...current, bars: [...current.bars, structuredClone(recognitionDraft.bar)], barLabels: [...current.bars.map((_, index) => current.barLabels?.[index] ?? ''), 'PDF draft'], section: undefined, review: undefined })); setSelectedBar(chart.bars.length); onDraftConsumed?.(); setMessage('Detected bar appended. Existing bars remain intact; Undo can remove it. Save as new to retain the chart.') }} className="rounded bg-cyan-800 px-3 py-2 disabled:opacity-40">Add detected bar</button><button onClick={onDraftConsumed} className="rounded border border-white/25 px-3 py-2">Discard detected draft</button></div></div>}
      <div className="flex flex-wrap gap-2"><button disabled={playing || !canUndo} onClick={() => { undo(); setConfirmClear(false) }} className="rounded border border-white/25 px-3 py-2 disabled:opacity-40">Undo</button><button disabled={playing || !canRedo} onClick={() => { redo(); setConfirmClear(false) }} className="rounded border border-white/25 px-3 py-2 disabled:opacity-40">Redo</button><button disabled={playing} onClick={() => setConfirmClear(true)} className="rounded border border-amber-300/40 px-3 py-2 disabled:opacity-40">Clear current bar</button></div>
      {confirmClear && !playing && <div role="alert" className="rounded-lg border border-amber-300 bg-amber-950/50 p-3"><p>Clear notes in bar {shownBar + 1}? Other bars, labels, and saved charts stay unchanged.</p><div className="mt-2 flex gap-2"><button onClick={() => { setChart((current) => ({ ...current, bars: current.bars.map((bar, index) => index === shownBar ? blankBar() : bar) })); setConfirmClear(false); setMessage('Bar cleared. Undo can restore its notes.') }} className="rounded bg-amber-700 px-3 py-2">Confirm clear bar</button><button onClick={() => setConfirmClear(false)} className="rounded border border-white/30 px-3 py-2">Cancel clear</button></div></div>}
      <p className="text-xs text-zinc-400">Undo/Redo retains the latest 50 chart edits during this visit. Disabled during playback. Saving, loading, or importing starts a new edit history; Undo does not change saved files or practice history.</p>
      <p className="text-xs text-zinc-400">Editable 4/4 grid with synchronized staff notation. Experimental PDF drafts require manual verification. Chart playback is separate from uploaded song audio.</p>
      <div className="grid gap-2 sm:grid-cols-2"><label className="text-sm">Style tag<input aria-label="Chart style" disabled={playing} maxLength={40} value={chart.style ?? ''} onChange={(event) => setChart((current) => ({ ...current, style: event.target.value }))} className="mt-1 w-full rounded border border-white/25 bg-zinc-900 p-2" placeholder="Rock, Funk..." /></label><label className="text-sm">Difficulty<select aria-label="Chart difficulty" disabled={playing} value={chart.difficulty ?? 'Beginner'} onChange={(event) => setChart((current) => ({ ...current, difficulty: event.target.value as SongChart['difficulty'] }))} className="mt-1 w-full rounded border border-white/25 bg-zinc-900 p-2">{['Beginner', 'Intermediate', 'Advanced', 'Expert'].map((value) => <option key={value}>{value}</option>)}</select></label></div>
      <button disabled={playing} onClick={() => { const copy = { ...structuredClone(chart), id: crypto.randomUUID(), title: (chart.title + ' copy').slice(0, 80) }; resetChart(copy); setSelectedSave(''); setSelectedBar(0); setMessage('Whole chart duplicated into editor. Save as new to retain it; original save is unchanged.') }} className="rounded border border-white/25 px-3 py-2 disabled:opacity-40">Duplicate whole chart</button>
      <label className="block text-sm">Chart title<input aria-label="Chart title" disabled={playing} maxLength={80} value={chart.title} onChange={(event) => setChart((current) => ({ ...current, title: event.target.value }))} className="mt-1 w-full rounded-lg border border-cyan-300/40 bg-zinc-800 p-2" /></label>
      <div className="flex flex-wrap gap-2">{chart.bars.map((_, index) => <button key={index} disabled={playing} aria-pressed={shownBar === index} onClick={() => { setSelectedBar(index); setConfirmClear(false) }} className={`rounded border px-3 py-2 ${shownBar === index ? 'border-amber-200 bg-amber-300/15' : 'border-white/20'}`}>Bar {index + 1}{chart.barLabels?.[index] ? `: ${chart.barLabels[index]}` : ''}</button>)}</div>
      <label className="block text-sm">Bar label<input aria-label="Bar label" disabled={playing} maxLength={40} value={chart.barLabels?.[selectedBar] ?? ''} onChange={(event) => setChart((current) => ({ ...current, barLabels: current.bars.map((_, index) => index === selectedBar ? event.target.value : current.barLabels?.[index] ?? '') }))} placeholder="Intro, Verse, Chorus..." className="mt-1 w-full rounded-lg border border-cyan-300/40 bg-zinc-800 p-2" /></label>
      <fieldset className="rounded border border-cyan-300/30 p-3"><legend className="px-1 text-sm font-semibold">Shown instruments</legend><div className="flex flex-wrap gap-3">{CHART_INSTRUMENTS.map((name) => <label key={name} className="text-sm"><input type="checkbox" checked={visible.includes(name)} onChange={(event) => changeVisible(event.target.checked ? CHART_INSTRUMENTS.filter((item) => item === name || visible.includes(item)) : visible.filter((item) => item !== name))} /> {name}</label>)}</div><div className="mt-2 flex gap-2"><button onClick={() => changeVisible(CHART_INSTRUMENTS)} className="rounded border border-white/25 px-3 py-2">Show all instruments</button><button onClick={() => changeVisible(['Hi-hat', 'Snare', 'Kick'])} className="rounded border border-white/25 px-3 py-2">Show basic kit</button></div><p className="mt-2 text-xs text-zinc-300">Visibility only: hidden notes still play and remain in saves. Use Mute to silence them. This device preference also filters the staff; hidden strokes may sound during visible rests.</p>{visible.length === 0 && <p className="text-sm text-amber-100">All instruments hidden. Show a row to edit notes.</p>}</fieldset>
      <ChartStaffNotation instruments={visible} bar={chart.bars[shownBar]} barNumber={shownBar + 1} activeStep={playing && countBeat === null ? active : -1} />
      <div className="overflow-x-auto rounded-lg border border-white/15 bg-black/25 p-2"><div className="min-w-[580px] space-y-3 p-1">
        <div className="grid grid-cols-[80px_repeat(16,minmax(0,1fr))] gap-1 text-center text-xs text-zinc-300"><span>Count</span>{Array.from({ length: 16 }, (_, index) => <span key={index}>{index % 4 === 0 ? index / 4 + 1 : ['e', '&', 'a'][index % 4 - 1]}</span>)}</div>
        {visible.map((instrument) => <div key={instrument} className="grid grid-cols-[80px_repeat(16,minmax(0,1fr))] gap-1"><span className="self-center text-sm text-cyan-100">{instrument}</span>{notesFor(chart.bars[shownBar], instrument).map((note, index) => <button key={index} aria-label={`${instrument} step ${index + 1}: ${['rest', 'ghost', 'note', 'accent'][note]}`} onClick={() => setChart((current) => cycleChartNote(current, shownBar, instrument, index))} className={`flex h-12 items-center justify-center rounded border text-sm ${playing && active === index ? 'ring-2 ring-amber-300' : ''} ${note === 3 ? 'border-amber-300 bg-amber-300/20 text-amber-100' : note ? 'border-cyan-300/40 bg-cyan-500/20 text-cyan-100' : 'border-white/15 bg-zinc-900 text-zinc-500'}`}>{note === 3 ? '>x' : note === 2 ? 'x' : note === 1 ? '(x)' : '-'}</button>)}</div>)}
      </div></div>
      <div role="status" className="rounded-lg border border-cyan-300/30 bg-cyan-950/30 p-3 text-sm text-cyan-100">{countBeat !== null ? `Count-in: ${countBeat} / 4 - prepare to play` : playing && active >= 0 ? `Bar ${activeBar + 1}, count ${active % 4 === 0 ? Math.floor(active / 4) + 1 : `${Math.floor(active / 4) + 1}${['e', '&', 'a'][active % 4 - 1]}`}: ${CHART_INSTRUMENTS.every((instrument) => notesFor(chart.bars[activeBar], instrument)[active] === 0) ? 'Rest - keep counting, no stroke' : 'Play highlighted notes'}` : 'Rest means no stroke on that instrument. Other instruments may still play.'}</div>
      <p className="text-xs text-zinc-400">- rest / x normal / (x) ghost / accented x. Each slot lasts one sixteenth note. Count 1 e & a, 2 e & a, 3 e & a, 4 e & a. Empty slots are silent but still take time.</p>
      <div className="flex flex-wrap gap-2"><button disabled={playing || chart.bars.length >= 16} onClick={() => { setChart((current) => ({ ...current, bars: [...current.bars, blankBar()], barLabels: [...current.bars.map((_, index) => current.barLabels?.[index] ?? ''), ''], section: undefined, review: undefined })); setSelectedBar(chart.bars.length) }} className="rounded border border-white/20 px-3 py-2 disabled:opacity-40">Add blank bar</button><button disabled={playing || chart.bars.length >= 16} onClick={() => { const copy = structuredClone(chart.bars[selectedBar]); setChart((current) => ({ ...current, bars: [...current.bars, copy], barLabels: [...current.bars.map((_, index) => current.barLabels?.[index] ?? ''), current.barLabels?.[selectedBar] ?? ''], section: undefined, review: undefined })); setSelectedBar(chart.bars.length) }} className="rounded border border-white/20 px-3 py-2 disabled:opacity-40">Duplicate bar</button><button disabled={playing || chart.bars.length === 1} onClick={() => { setChart((current) => ({ ...current, bars: current.bars.filter((_, index) => index !== selectedBar), barLabels: current.bars.map((_, index) => current.barLabels?.[index] ?? '').filter((_, index) => index !== selectedBar), section: undefined, review: undefined })); setSelectedBar(0) }} className="rounded border border-white/20 px-3 py-2 disabled:opacity-40">Remove bar</button></div>
      <p role="status" className="text-sm text-cyan-200">{message}</p>
    </GlassCard>
    <GlassCard layout={false} className="min-w-0 space-y-3">
      <h3 className="font-semibold">Chart Controls</h3>
      <label className="block text-sm">Count-in<select aria-label="Chart count-in" disabled={playing} value={chart.countIn ?? 0} onChange={(event) => setChart((current) => ({ ...current, countIn: Number(event.target.value) }))} className="mt-1 w-full rounded border border-white/25 bg-zinc-900 p-2"><option value={0}>Off</option><option value={4}>1 bar (4 beats)</option><option value={8}>Legacy 2-bar selection (4-beat count-in)</option></select></label>
      <p className="text-xs text-zinc-300">Both enabled selections count 1 to 4 once. Older two-bar settings also use four preparation beats. It does not repeat on each loop. Stop cancels it. Count-in time is excluded from practice history.</p>
      <div className="grid grid-cols-2 gap-2">{(['start', 'end'] as const).map((edge) => <label key={edge} className="text-sm">{edge === 'start' ? 'Start bar' : 'End bar'}<select aria-label={edge === 'start' ? 'Start bar' : 'End bar'} disabled={playing} value={chartSection(chart)[edge]} onChange={(event) => { const value = Number(event.target.value); setChart((current) => { const section = chartSection(current); return { ...current, section: edge === 'start' ? { start: value, end: Math.max(value, section.end) } : { start: Math.min(value, section.start), end: value } } }) }} className="mt-1 w-full rounded border border-white/25 bg-zinc-900 p-2">{chart.bars.map((_, index) => <option key={index} value={index}>Bar {index + 1}</option>)}</select></label>)}</div>
      <button disabled={playing} onClick={() => setChart((current) => ({ ...current, section: undefined }))} className="rounded border border-white/25 px-3 py-2 disabled:opacity-40">Use full chart</button>
      <p className="text-xs text-zinc-300">Play bars {chartSection(chart).start + 1} to {chartSection(chart).end + 1}. Loop repeats this section. Adding, duplicating, or removing bars resets the range to the full chart.</p>
      <label className="block text-sm">Tempo {chart.bpm} BPM<input aria-label="Chart BPM" type="range" min={40} max={240} value={chart.bpm} onChange={(event) => setChart((current) => ({ ...current, bpm: Number(event.target.value) }))} className="mt-2 w-full accent-cyan-400" /></label>
      <label className="block text-sm">Volume {Math.round(volume * 100)}%<input aria-label="Chart volume" type="range" min={0} max={1} step={0.01} value={volume} onChange={(event) => setVolume(Number(event.target.value))} className="mt-2 w-full accent-cyan-400" /></label>
      <div className="flex flex-wrap gap-2"><button disabled={playing} onClick={() => void start()} className="rounded bg-cyan-700 px-3 py-2 disabled:opacity-40">{playing ? countBeat !== null ? 'Counting in' : 'Playing' : 'Play chart'}</button><button disabled={!playing} onClick={() => { stop(); setMessage('Chart stopped. Session saved.') }} className="rounded border border-white/30 px-3 py-2 disabled:opacity-40">Stop chart</button><button aria-pressed={loop} onClick={() => setLoop((current) => !current)} className="rounded border border-white/30 px-3 py-2">Loop {loop ? 'On' : 'Off'}</button></div>
      <ChartPracticeControls chart={chart} setChart={setChart} playing={playing} cycles={cycles} />
      <label className="block text-sm">Search saved charts<input aria-label="Search saved charts" value={search} onChange={(event) => setSearch(event.target.value)} className="mt-1 w-full rounded border border-white/25 bg-zinc-900 p-2" placeholder="Title, style or difficulty" /></label>
      <label className="block text-sm">Saved charts<select aria-label="Saved charts" disabled={playing} value={selectedSave} onChange={(event) => setSelectedSave(event.target.value)} className="mt-1 w-full rounded-lg border border-white/20 bg-zinc-900 p-2"><option value="">Select chart</option>{saved.filter((item) => `${item.title} ${item.style ?? ''} ${item.difficulty ?? ''}`.toLowerCase().includes(search.toLowerCase()) || item.id === selectedSave).map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select></label>
      <div className="flex flex-wrap gap-2"><button disabled={playing} onClick={() => persist(false)} className="rounded border border-white/20 px-3 py-2 disabled:opacity-40">Save as new</button><button disabled={playing || !selectedSave} onClick={() => persist(true)} className="rounded border border-white/20 px-3 py-2 disabled:opacity-40">Update selected chart</button><button disabled={playing || !selectedSave} onClick={() => { const loaded = saved.find((item) => item.id === selectedSave); if (loaded) { resetChart(structuredClone(loaded)); setSelectedBar(0); setMessage('Saved chart loaded.') } }} className="rounded border border-white/20 px-3 py-2 disabled:opacity-40">Load chart</button><button disabled={playing || !selectedSave} onClick={() => { try { const next = saved.filter((item) => item.id !== selectedSave); saveSongCharts(next); setSaved(next); setSelectedSave(''); setMessage('Selected save deleted. Editor and practice history are unchanged.') } catch { setMessage('Could not delete saved chart.') } }} className="rounded border border-white/20 px-3 py-2 disabled:opacity-40">Delete saved chart</button></div>
      <button onClick={() => { if (!isSongChart(chart)) { setMessage('Enter a valid chart title and settings before exporting.'); return } const url = URL.createObjectURL(new Blob([JSON.stringify({ app: 'DrumMaster AI Chart', schema: 1, chart: normalizeReview(chart) }, null, 2)], { type: 'application/json' })); const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'drummaster-chart.json'; anchor.click(); window.setTimeout(() => URL.revokeObjectURL(url), 1000) }} className="rounded border border-white/20 px-3 py-2">Export chart JSON</button>
      <label className="block text-sm">Import chart JSON<input aria-label="Import chart JSON" disabled={playing} type="file" accept=".json,application/json" onChange={(event) => { const file = event.target.files?.[0]; event.target.value = ''; if (file) void importFile(file) }} className="mt-2 block w-full text-xs file:mr-2 file:rounded file:border-0 file:bg-cyan-300 file:p-2 file:text-slate-950" /></label>
      <p className="text-xs text-zinc-400">Up to 16 bars. Structural edits stop while playing; note edits stay live. Chart saves are local and are not included in practice-history backups. Export chart JSON to back them up. Playback records practice time, not measured accuracy.</p>
    </GlassCard>
  </div>
}
