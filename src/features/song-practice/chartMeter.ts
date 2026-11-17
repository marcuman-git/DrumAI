import { CHART_INSTRUMENTS, completeBar, notesFor } from './chartKit'
import type { ChartBar } from './chartKit'
import type { SongChart } from './songChartLogic'
export type ChartMeter = '2/4' | '4/4'
export function barSlots(bar: ChartBar) { return bar.beats === 2 ? 8 : 16 }
export function chartSlots(chart: SongChart) { return chart.meter === '2/4' ? 8 : 16 }
/** Split/join preserves all onsets; refuses unsupported ties or ambiguous duration metadata. */
export function changeChartMeter(chart: SongChart, meter: ChartMeter): SongChart {
 if ((chart.meter ?? '4/4') === meter) return chart
 const bars: ChartBar[] = []; const labels: string[] = []
 if (meter === '2/4') {
  if (chart.bars.length > 8) throw new Error('Splitting would exceed 16 bars. Use a shorter chart first.')
  chart.bars.forEach((bar, index) => {
   if(bar.rhythmEvents?.some(event=>event.step===8&&event.tieFromPrevious))throw new Error('A tie crosses the split boundary. Review as separate untied bars before conversion.')
   if (bar.rhythmEvents?.some((event) => event.step < 8 && event.step + event.duration > 8)) throw new Error('A reviewed duration crosses beat 3. Split/correct that duration before meter conversion; ties are unsupported.')
   for (const offset of [0, 8]) {
    const half: ChartBar = { ...completeBar(), beats: 2 }
    for (const instrument of CHART_INSTRUMENTS) half[instrument] = [...notesFor(bar, instrument).slice(offset, offset + 8), ...Array<number>(8).fill(0)]
    if (bar.rhythmEvents) half.rhythmEvents = bar.rhythmEvents.filter((event) => event.step >= offset && event.step < offset + 8).map((event) => ({ ...event, step: event.step - offset }))
    bars.push(half); labels.push((chart.barLabels?.[index] ? `${chart.barLabels[index]} ${offset ? 'B' : 'A'}` : '').slice(0, 40))
   }
  })
 } else {
  if (chart.bars.length % 2) throw new Error('Add a second 2/4 bar before joining pairs into 4/4.')
  for (let index = 0; index < chart.bars.length; index += 2) {
   const left = chart.bars[index]; const right = chart.bars[index + 1]
   if (!!left.rhythmEvents !== !!right.rhythmEvents) throw new Error('Both joined bars must have reviewed durations, or both must be grid-only.')
   const joined: ChartBar = completeBar()
   for (const instrument of CHART_INSTRUMENTS) joined[instrument] = [...notesFor(left, instrument).slice(0, 8), ...notesFor(right, instrument).slice(0, 8)]
   if (left.rhythmEvents && right.rhythmEvents) joined.rhythmEvents = [...left.rhythmEvents.map((event) => ({ ...event })), ...right.rhythmEvents.map((event) => ({ ...event, step: event.step + 8 }))]
   bars.push(joined); labels.push([chart.barLabels?.[index], chart.barLabels?.[index + 1]].filter(Boolean).join(' / ').slice(0, 40))
  }
 }
 return { ...chart, meter, bars, barLabels: labels, section: undefined, review: undefined }
}
