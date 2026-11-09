import { CHART_INSTRUMENTS, completeBar } from './chartKit'
import type { ChartBar, ChartInstrument } from './chartKit'
import type { RhythmEvent } from './rhythmTypes'
export type { RhythmEvent } from './rhythmTypes'
export function validRhythmEvents(value: unknown): value is RhythmEvent[] {
  return Array.isArray(value) && value.length <= 192 && value.every((event) => event && CHART_INSTRUMENTS.includes(event.instrument) && Number.isInteger(event.step) && event.step >= 0 && event.step < 16 && [1, 2, 4].includes(event.duration) && event.step + event.duration <= 16 && ['note', 'rest'].includes(event.kind) && [1, 2, 3].includes(event.dynamic))
}
export function checkReviewedRhythm(events: RhythmEvent[]) {
  let overlaps = 0; let missing = 0
  if (!validRhythmEvents(events)) return { valid: false, overlaps: 0, missing: 16, voices: 0 }
  const used = [...new Set(events.map((event) => event.instrument))]
  for (const instrument of used) {
    const coverage = Array<number>(16).fill(0)
    for (const event of events.filter((item) => item.instrument === instrument)) for (let step = event.step; step < event.step + event.duration; step++) coverage[step]++
    overlaps += coverage.filter((count) => count > 1).length
    missing += coverage.filter((count) => count === 0).length
  }
  return { valid: used.length > 0 && !overlaps && !missing, overlaps, missing, voices: used.length }
}
export function reviewedBar(events: RhythmEvent[]): ChartBar {
  if (!checkReviewedRhythm(events).valid) throw new Error('Resolve missing time and overlaps before confirming.')
  const bar: ChartBar = completeBar()
  for (const event of events) if (event.kind === 'note') bar[event.instrument]![event.step] = event.dynamic
  bar.rhythmEvents = structuredClone(events)
  return bar
}
export function validReviewedBar(bar: ChartBar): boolean {
  if (bar.rhythmEvents === undefined) return true
  if (!checkReviewedRhythm(bar.rhythmEvents).valid) return false
  const expected = reviewedBar(bar.rhythmEvents)
  return CHART_INSTRUMENTS.every((instrument) => {
    const actual = bar[instrument] ?? Array<number>(16).fill(0)
    return Array.isArray(actual) && actual.length === 16 && actual.every((value, step) => value === expected[instrument]![step])
  })
}
export function fillReviewedRests(events: RhythmEvent[], instrument: ChartInstrument): RhythmEvent[] {
  const covered = new Set<number>()
  for (const event of events.filter((item) => item.instrument === instrument)) for (let step = event.step; step < event.step + event.duration; step++) covered.add(step)
  return [...events, ...Array.from({ length: 16 }, (_, step) => step).filter((step) => !covered.has(step)).map((step): RhythmEvent => ({ instrument, step, duration: 1, kind: 'rest', dynamic: 2 }))]
}
