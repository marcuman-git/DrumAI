import { CHART_INSTRUMENTS } from './chartKit'
import type { ChartInstrument } from './chartKit'
import type { RhythmEvent } from './rhythmTypes'
export interface SlotRange { start: number; end: number }
function ranges(slots: number[]): SlotRange[] {
 const result: SlotRange[] = []
 for (const slot of slots) { const last = result[result.length - 1]; if (last && last.end + 1 === slot) last.end = slot; else result.push({ start: slot, end: slot }) }
 return result
}
/** Reports each participating voice independently; simultaneous different drums do not conflict. */
export function diagnoseReviewedRhythm(events: readonly RhythmEvent[]) {
 return CHART_INSTRUMENTS.filter((instrument) => events.some((event) => event.instrument === instrument)).map((instrument) => {
  const coverage = Array.from({ length: 16 }, () => [] as number[])
  const overflowEvents: number[] = []
  events.forEach((event, index) => {
   if (event.instrument !== instrument) return
   if (event.step + event.duration > 16) overflowEvents.push(index)
   for (let slot = Math.max(0, event.step); slot < Math.min(16, event.step + event.duration); slot++) coverage[slot].push(index)
  })
  const gaps = ranges(coverage.flatMap((owners, slot) => owners.length === 0 ? [slot + 1] : []))
  const overlaps = ranges(coverage.flatMap((owners, slot) => owners.length > 1 ? [slot + 1] : []))
  const conflictEvents = [...new Set(coverage.filter((owners) => owners.length > 1).flat())]
  return { instrument, gaps, overlaps, conflictEvents, overflowEvents }
 })
}
export function fillNextReviewedGap(events: readonly RhythmEvent[], instrument: ChartInstrument): RhythmEvent[] {
 const voice = diagnoseReviewedRhythm(events).find((item) => item.instrument === instrument)
 const gap = voice?.gaps[0] ?? (voice ? undefined : { start: 1, end: 16 })
 if (!gap) return [...events]
 const added: RhythmEvent[] = []
 let step = gap.start - 1
 while (step < gap.end) {
  const remaining = gap.end - step
  const duration = remaining >= 4 ? 4 : remaining >= 2 ? 2 : 1
  added.push({ instrument, step, duration, kind: 'rest', dynamic: 2 }); step += duration
 }
 if (events.length + added.length > 192) return [...events]
 return [...events, ...added]
}
export function formatSlotRanges(ranges: readonly SlotRange[]) { return ranges.map((range) => range.start === range.end ? `${range.start}` : `${range.start}-${range.end}`).join(', ') || 'None' }
