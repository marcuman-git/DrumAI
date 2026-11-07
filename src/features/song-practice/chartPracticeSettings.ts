const CHART_INSTRUMENTS = ['Hi-hat', 'Snare', 'Kick'] as const
import type { ChartInstrument } from './songChartLogic'
export interface InstrumentMix { volume: number; muted: boolean; solo: boolean }
export type ChartMix = Record<ChartInstrument, InstrumentMix>
export interface ChartTraining { enabled: boolean; repetitions: number; ladder: boolean; increment: number; every: number }
export function defaultMix(): ChartMix { return Object.fromEntries(CHART_INSTRUMENTS.map((name) => [name, { volume: 1, muted: false, solo: false }])) as ChartMix }
export function defaultTraining(): ChartTraining { return { enabled: false, repetitions: 4, ladder: false, increment: 2, every: 1 } }
export function mixLevel(mix: ChartMix, instrument: ChartInstrument): number {
  const row = mix[instrument]
  return row.muted || (CHART_INSTRUMENTS.some((name) => mix[name].solo) && !row.solo) ? 0 : row.volume
}
export function validMix(value: unknown): value is ChartMix {
  if (!value || typeof value !== 'object') return false
  const mix = value as ChartMix
  return CHART_INSTRUMENTS.every((name) => mix[name] && typeof mix[name].volume === 'number' && Number.isFinite(mix[name].volume) && mix[name].volume >= 0 && mix[name].volume <= 1 && typeof mix[name].muted === 'boolean' && typeof mix[name].solo === 'boolean')
}
export function validTraining(value: unknown): value is ChartTraining {
  if (!value || typeof value !== 'object') return false
  const t = value as ChartTraining
  return typeof t.enabled === 'boolean' && typeof t.ladder === 'boolean' && Number.isInteger(t.repetitions) && t.repetitions >= 1 && t.repetitions <= 100 && Number.isInteger(t.increment) && t.increment >= 1 && t.increment <= 10 && Number.isInteger(t.every) && t.every >= 1 && t.every <= 16
}
export function ladderBpm(bpm: number, training: ChartTraining, cycles: number) { return training.enabled && training.ladder && cycles % training.every === 0 ? Math.min(240, bpm + training.increment) : bpm }
