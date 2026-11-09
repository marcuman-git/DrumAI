export const CHART_INSTRUMENTS = ['Hi-hat', 'Snare', 'Kick', 'Crash', 'Ride', 'Kick 2', 'Floor tom 2', 'Floor tom 1', 'Tom 3', 'Tom 2', 'Tom 1', 'Pedal hi-hat'] as const
export type ChartInstrument = typeof CHART_INSTRUMENTS[number]
export type ChartBar = Record<'Hi-hat' | 'Snare' | 'Kick', number[]> & Partial<Record<Exclude<ChartInstrument, 'Hi-hat' | 'Snare' | 'Kick'>, number[]>> & { rhythmEvents?: import('./rhythmTypes').RhythmEvent[] }
export function isCoreInstrument(name: ChartInstrument) { return name === 'Hi-hat' || name === 'Snare' || name === 'Kick' }
const RESTS = Object.freeze(Array<number>(16).fill(0))
/** Legacy charts omit cymbal rows; reading them must never mutate the saved chart. */
export function notesFor(bar: ChartBar, instrument: ChartInstrument): readonly number[] { return bar[instrument] ?? RESTS }
export function completeBar(): Record<ChartInstrument, number[]> { return Object.fromEntries(CHART_INSTRUMENTS.map((name) => [name, Array<number>(16).fill(0)])) as Record<ChartInstrument, number[]> }
