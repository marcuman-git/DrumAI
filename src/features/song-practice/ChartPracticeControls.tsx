import type { SetStateAction } from 'react'
import { CHART_INSTRUMENTS } from './songChartLogic'
import type { SongChart, ChartInstrument } from './songChartLogic'
import { completeMix, defaultMix, defaultTraining } from './chartPracticeSettings'
export function ChartPracticeControls({ chart, setChart, playing, cycles, instruments = CHART_INSTRUMENTS, compactTraining=false }: { chart: SongChart; setChart: (update: SetStateAction<SongChart>) => void; playing: boolean; cycles: number; compactTraining?:boolean; instruments?: readonly ChartInstrument[] }) {
  const mix = completeMix(chart.mix)
  const training = chart.training ?? defaultTraining()
  const trainingControls=<>
    <h4 className="font-semibold">Repetition Training</h4>
    <label className="block text-sm"><input type="checkbox" aria-label="Repetition training" disabled={playing} checked={training.enabled} onChange={(event) => setChart((current) => ({ ...current, training: { ...(current.training ?? defaultTraining()), enabled: event.target.checked } }))} /> Enable repetition target</label>
    {(['repetitions', 'increment', 'every'] as const).map((key) => <label key={key} className="block text-sm">{key === 'repetitions' ? 'Target cycles' : key === 'increment' ? 'BPM increase' : 'Increase every (cycles)'}<select aria-label={key} disabled={playing} value={training[key]} onChange={(event) => { const value = Number(event.target.value); setChart((current) => ({ ...current, training: { ...(current.training ?? defaultTraining()), [key]: value } })) }} className="mt-1 w-full rounded border border-white/25 bg-zinc-900 p-2">{Array.from({ length: key === 'repetitions' ? 100 : key === 'increment' ? 10 : 16 }, (_, index) => <option key={index} value={index + 1}>{index + 1}</option>)}</select></label>)}
    <label className="block text-sm"><input type="checkbox" aria-label="Tempo ladder" disabled={playing} checked={training.ladder} onChange={(event) => setChart((current) => ({ ...current, training: { ...(current.training ?? defaultTraining()), ladder: event.target.checked, enabled: event.target.checked || (current.training ?? defaultTraining()).enabled } }))} /> Enable tempo ladder</label>
    <p className="text-sm text-cyan-100">{training.enabled && training.ladder ? `Ladder active: +${training.increment} BPM every ${training.every} cycle(s). Next increase after cycle ${(Math.floor(cycles / training.every) + 1) * training.every}, unless the target ends first.` : 'Tempo ladder inactive. Enable it to turn on repetition training.'}</p>
    <p role="status" className="text-sm text-cyan-100">Completed cycles: {cycles}{training.enabled ? ` / ${training.repetitions}` : ''}</p>
    <p className="text-xs text-zinc-400">One cycle is the selected bar range. Training starts with Loop On and stops at its target. Turning Loop Off finishes the current cycle early. Tempo rises between cycles, capped at 240 BPM. These are playback cycles, not measured performance.</p>
</>
  return <div className="space-y-3 rounded-lg border border-white/20 p-3">
    <h4 className="font-semibold">Instrument Mix</h4>
    <div aria-label="Instrument mix boxes" className="grid grid-cols-2 gap-2">
      {instruments.map((instrument) => <div key={instrument} className={`min-w-0 space-y-2 rounded-lg border p-2 ${mix[instrument].muted ? 'border-white/15 bg-zinc-900/70' : mix[instrument].solo ? 'border-amber-200/60 bg-amber-300/10' : 'border-cyan-300/25 bg-cyan-950/20'}`}>
        <div className="flex min-h-6 flex-wrap items-center justify-between gap-1"><span className="text-sm font-medium">{instrument}</span>{mix[instrument].volume !== 1 && <span className="text-xs text-zinc-400" title="Saved instrument level; Reset instrument mix restores full level">Level {Math.round(mix[instrument].volume * 100)}%</span>}</div>
        <div className="grid grid-cols-2 gap-1">{(['muted', 'solo'] as const).map((key) => <button key={key} aria-label={`${instrument} ${key === 'muted' ? 'mute' : 'solo'}`} aria-pressed={mix[instrument][key]} onClick={() => setChart((current) => { const value = completeMix(current.mix); return { ...current, mix: { ...value, [instrument]: { ...value[instrument], [key]: !value[instrument][key] } } } })} className={`min-h-11 rounded border px-1 py-2 text-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200 ${mix[instrument][key] ? 'border-amber-200 bg-amber-300/20 text-amber-100' : 'border-white/25'}`}>{key === 'muted' ? 'Mute' : 'Solo'}</button>)}</div>
      </div>)}
    </div>
    <button onClick={() => setChart((current) => ({ ...current, mix: defaultMix() }))} className="rounded border border-white/25 px-3 py-2 text-sm">Reset instrument mix</button>
    <p className="text-xs text-zinc-400">Use the chart Volume control for overall loudness. Saved instrument levels are preserved; Reset restores full levels. Hidden instruments retain their mix settings and may still play. Show All to adjust them. Reset resets all instruments. Mute overrides Solo. Multiple solo instruments can play together. Mix updates upcoming notes without restarting; chart notes stay unchanged.</p>
    {compactTraining?<details><summary className="cursor-pointer font-semibold">Repetition and tempo training</summary>{trainingControls}</details>:trainingControls}
  </div>
}
