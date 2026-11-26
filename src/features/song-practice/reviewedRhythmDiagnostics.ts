import {RHYTHM_TICKS,timeTick,tickTime,decomposeTime} from './rhythmTime'
import { CHART_INSTRUMENTS } from './chartKit'
import type { ChartInstrument } from './chartKit'
import type { RhythmEvent } from './rhythmTypes'
export interface SlotRange { start: number; end: number;endExclusive?:number }
function ranges(slots: number[]): SlotRange[] {
 const result: SlotRange[] = []
 for (const slot of slots) { const last = result[result.length - 1]; if (last && Math.abs(last.end + 1/RHYTHM_TICKS-slot)<.001) last.end = slot; else result.push({ start: slot, end: slot }) }
 return result.map(range=>{const end=range.end+1/RHYTHM_TICKS-1;return Number.isInteger(range.start-1)&&Math.abs(end-Math.round(end))<.001?{start:range.start,end:Math.round(end)}:{start:range.start,end:end+1,endExclusive:end}})
}
/** Reports each participating voice independently; simultaneous different drums do not conflict. */
export function diagnoseReviewedRhythm(events: readonly RhythmEvent[], slots = 16) {
 return CHART_INSTRUMENTS.filter((instrument) => events.some((event) => event.instrument === instrument)).map((instrument) => {
  const coverage = Array.from({ length: slots*RHYTHM_TICKS }, () => [] as number[])
  const overflowEvents: number[] = []
  events.forEach((event, index) => {
   if (event.instrument !== instrument) return
   if (event.step + event.duration > slots) overflowEvents.push(index)
   for (let slot = Math.max(0, timeTick(event.step)); slot < Math.min(slots*RHYTHM_TICKS, timeTick(event.step + event.duration)); slot++) coverage[slot].push(index)
  })
  const gaps = ranges(coverage.flatMap((owners, slot) => owners.length === 0 ? [tickTime(slot) + 1] : []))
  const overlaps = ranges(coverage.flatMap((owners, slot) => owners.length > 1 ? [tickTime(slot) + 1] : []))
  const conflictEvents = [...new Set(coverage.filter((owners) => owners.length > 1).flat())]
  return { instrument, gaps, overlaps, conflictEvents, overflowEvents }
 })
}
export function fillNextReviewedGap(events: readonly RhythmEvent[], instrument: ChartInstrument, slots = 16): RhythmEvent[] {
 const voice = diagnoseReviewedRhythm(events, slots).find((item) => item.instrument === instrument)
 const gap = voice?.gaps[0] ?? (voice ? undefined : { start: 1, end: slots })
 if (!gap) return [...events]
 const added: RhythmEvent[] = []
 let step = gap.start - 1
 while (step < (gap.endExclusive??gap.end)-.001) {
  const remaining = (gap.endExclusive??gap.end) - step
  const duration = remaining >= 4 ? 4 : remaining >= 2 ? 2 : remaining>=1?1:decomposeTime(step,remaining)[0].duration
  added.push({ instrument, step, duration, kind: 'rest', dynamic: 2 }); step += duration
 }
 if (events.length + added.length > 4096) return [...events]
 return [...events, ...added]
}
export function formatSlotRanges(ranges: readonly SlotRange[]) { return ranges.map((range) => range.start === range.end ? `${range.start}` : `${range.start}-${range.end}`).join(', ') || 'None' }
