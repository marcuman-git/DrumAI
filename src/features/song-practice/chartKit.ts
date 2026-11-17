export const CHART_INSTRUMENTS = ['Hi-hat', 'Snare', 'Kick', 'Crash', 'Ride', 'Kick 2', 'Floor tom 2', 'Floor tom 1', 'Tom 3', 'Tom 2', 'Tom 1', 'Pedal hi-hat', 'Open hi-hat', 'China', 'Splash', 'Ride bell'] as const
export type ChartInstrument = typeof CHART_INSTRUMENTS[number]
export type ChartBar = Record<'Hi-hat' | 'Snare' | 'Kick', number[]> & Partial<Record<Exclude<ChartInstrument, 'Hi-hat' | 'Snare' | 'Kick'>, number[]>> & { beats?: 2 | 4; rhythmEvents?: import('./rhythmTypes').RhythmEvent[] }
export function isCoreInstrument(name: ChartInstrument) { return name === 'Hi-hat' || name === 'Snare' || name === 'Kick' }
const RESTS = Object.freeze(Array<number>(16).fill(0))
/** Legacy charts omit cymbal rows; reading them must never mutate the saved chart. */
export function notesFor(bar: ChartBar, instrument: ChartInstrument): readonly number[] { return bar[instrument] ?? RESTS }
export function completeBar(): Record<ChartInstrument, number[]> { return Object.fromEntries(CHART_INSTRUMENTS.map((name) => [name, Array<number>(16).fill(0)])) as Record<ChartInstrument, number[]> }

/** Dropping duration review turns each formerly tied head into a grid strike. */
export function withoutReviewedDurations(bar:ChartBar):ChartBar {
 if(!bar.rhythmEvents)return bar
 const next:ChartBar={...bar,rhythmEvents:undefined}
 for(const instrument of CHART_INSTRUMENTS){const notes=[...notesFor(bar,instrument)];for(const event of bar.rhythmEvents)if(event.instrument===instrument&&event.kind==='note')notes[event.step]=event.dynamic;next[instrument]=notes}
 return next
}
