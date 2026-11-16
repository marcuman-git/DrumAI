import { CHART_INSTRUMENTS, notesFor } from './chartKit'
import type { ChartBar } from './chartKit'
import { barSlots } from './chartMeter'
import type { RhythmEvent } from './rhythmTypes'
import type { StaffCountMode } from './staffCountLabels'
/** Display grouping only: every original onset is retained. Reviewed durations take priority. */
export function groupedGridNotation(bar: ChartBar, mode: StaffCountMode): ChartBar {
 if (bar.rhythmEvents || mode === 'sixteenth') return bar
 const slots = barSlots(bar); const maxDuration = mode === 'quarter' ? 4 : 2
 let voices = CHART_INSTRUMENTS.filter((instrument) => notesFor(bar, instrument).slice(0, slots).some(Boolean))
 if (!voices.length) voices = ['Hi-hat']
 const events: RhythmEvent[] = []
 for (const instrument of voices) {
  const notes = notesFor(bar, instrument); let step = 0
  while (step < slots) {
   let nextOnset = step + 1
   while (nextOnset < slots && !notes[nextOnset]) nextOnset++
   const available = Math.min(maxDuration - (step % maxDuration), nextOnset - step)
   const duration = available >= 4 ? 4 : available >= 2 ? 2 : 1
   events.push({ instrument, step, duration, kind: notes[step] ? 'note' : 'rest', dynamic: (notes[step] || 2) as 1 | 2 | 3 }); step += duration
  }
 }
 return { ...bar, rhythmEvents: events }
}
