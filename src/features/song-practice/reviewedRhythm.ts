import {validSourceAnchor} from './sourceTrace'
import { CHART_INSTRUMENTS, completeBar } from './chartKit'
import type { ChartBar, ChartInstrument } from './chartKit'
import type { RhythmEvent } from './rhythmTypes'
export type { RhythmEvent } from './rhythmTypes'
export function validRhythmEvents(value: unknown, slots = 16): value is RhythmEvent[] {
  return Array.isArray(value) && value.length <= 192 && value.every((event) => event && (event.sourceAnchor===undefined||validSourceAnchor(event.sourceAnchor)) && CHART_INSTRUMENTS.includes(event.instrument) && Number.isInteger(event.step) && event.step >= 0 && event.step < slots && [1, 2, 3, 4, 6].includes(event.duration) && event.step + event.duration <= slots && ['note', 'rest'].includes(event.kind) && [1, 2, 3].includes(event.dynamic))
}
export function checkReviewedRhythm(events: RhythmEvent[], slots = 16, previousBar?: ChartBar) {
  let overlaps = 0; let missing = 0
  if (!validRhythmEvents(events, slots)) return { valid: false, overlaps: 0, missing: slots, voices: 0 }
  if (events.some(event => event.tieFromPrevious !== undefined && typeof event.tieFromPrevious !== 'boolean' || event.tieFromPrevious && (event.kind !== 'note' || !events.some(previous => previous.instrument === event.instrument && previous.kind === 'note' && previous.step + previous.duration === event.step) && !(event.step === 0 && previousBar?.rhythmEvents?.some(previous => previous.instrument === event.instrument && previous.kind === 'note' && previous.step + previous.duration === (previousBar.beats === 2 ? 8 : 16)))))) return { valid: false, overlaps: 0, missing: slots, voices: 0 }
  const used = [...new Set(events.map((event) => event.instrument))]
  for (const instrument of used) {
    const coverage = Array<number>(slots).fill(0)
    for (const event of events.filter((item) => item.instrument === instrument)) for (let step = event.step; step < event.step + event.duration; step++) coverage[step]++
    overlaps += coverage.filter((count) => count > 1).length
    missing += coverage.filter((count) => count === 0).length
  }
  return { valid: used.length > 0 && !overlaps && !missing, overlaps, missing, voices: used.length }
}
export function reviewedBar(events: RhythmEvent[], slots = 16, previousBar?: ChartBar): ChartBar {
  if (!checkReviewedRhythm(events, slots, previousBar).valid) throw new Error('Resolve missing time and overlaps before confirming.')
  const bar: ChartBar = { ...completeBar(), ...(slots === 8 ? { beats: 2 as const } : {}) }
  for (const event of events) if (event.kind === 'note' && !event.tieFromPrevious) bar[event.instrument]![event.step] = event.dynamic
  bar.rhythmEvents = events.map(({ instrument, step, duration, kind, dynamic, tieFromPrevious,sourceAnchor }) => ({ instrument, step, duration, kind, dynamic, ...(tieFromPrevious ? { tieFromPrevious } : {}),...(sourceAnchor?{sourceAnchor:{...sourceAnchor}}:{}) }))
  return bar
}
export function validReviewedBar(bar: ChartBar, previousBar?: ChartBar): boolean {
  const slots = bar.beats === 2 ? 8 : 16
  if (bar.rhythmEvents === undefined) return true
  if (!checkReviewedRhythm(bar.rhythmEvents, slots, previousBar).valid) return false
  const expected = reviewedBar(bar.rhythmEvents, slots, previousBar)
  return CHART_INSTRUMENTS.every((instrument) => {
    const actual = bar[instrument] ?? Array<number>(16).fill(0)
    return Array.isArray(actual) && actual.length === 16 && actual.every((value, step) => value === expected[instrument]![step])
  })
}
export function fillReviewedRests(events: RhythmEvent[], instrument: ChartInstrument, slots = 16): RhythmEvent[] {
  const covered = new Set<number>()
  for (const event of events.filter((item) => item.instrument === instrument)) for (let step = event.step; step < event.step + event.duration; step++) covered.add(step)
  return [...events, ...Array.from({ length: slots }, (_, step) => step).filter((step) => !covered.has(step)).map((step): RhythmEvent => ({ instrument, step, duration: 1, kind: 'rest', dynamic: 2 }))]
}
