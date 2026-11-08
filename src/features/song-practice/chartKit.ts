export const CHART_INSTRUMENTS = ['Hi-hat', 'Snare', 'Kick', 'Crash', 'Ride'] as const
export type ChartInstrument = typeof CHART_INSTRUMENTS[number]
export type ChartBar = Record<'Hi-hat' | 'Snare' | 'Kick', number[]> & Partial<Record<'Crash' | 'Ride', number[]>>
const RESTS = Object.freeze(Array<number>(16).fill(0))
/** Legacy charts omit cymbal rows; reading them must never mutate the saved chart. */
export function notesFor(bar: ChartBar, instrument: ChartInstrument): readonly number[] { return bar[instrument] ?? RESTS }
export function completeBar(): Record<ChartInstrument, number[]> { return Object.fromEntries(CHART_INSTRUMENTS.map((name) => [name, Array<number>(16).fill(0)])) as Record<ChartInstrument, number[]> }
