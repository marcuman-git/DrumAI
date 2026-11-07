import type { ChartBar, ChartInstrument, SongChart } from './songChartLogic'
export type RowPattern = 'Clear' | 'Quarter notes' | 'Eighth notes' | 'Sixteenth notes' | 'Offbeat eighths'
export const ROW_PATTERNS: RowPattern[] = ['Clear', 'Quarter notes', 'Eighth notes', 'Sixteenth notes', 'Offbeat eighths']
export function patternRow(pattern: RowPattern): number[] {
  return Array.from({ length: 16 }, (_, index) => pattern === 'Clear' ? 0 : pattern === 'Sixteenth notes' || (pattern === 'Quarter notes' && index % 4 === 0) || (pattern === 'Eighth notes' && index % 2 === 0) || (pattern === 'Offbeat eighths' && index % 4 === 2) ? 2 : 0)
}
export function replaceChartBar(chart: SongChart, index: number, bar: ChartBar, label?: string): SongChart {
  if (index < 0 || index >= chart.bars.length) return chart
  return { ...chart, bars: chart.bars.map((current, position) => position === index ? structuredClone(bar) : current), ...(label === undefined ? {} : { barLabels: chart.bars.map((_, position) => position === index ? label : chart.barLabels?.[position] ?? '') }) }
}
export function replaceChartRow(chart: SongChart, index: number, instrument: ChartInstrument, row: number[]): SongChart {
  if (!chart.bars[index] || row.length !== 16 || !row.every((note) => Number.isInteger(note) && note >= 0 && note <= 3)) return chart
  return replaceChartBar(chart, index, { ...chart.bars[index], [instrument]: [...row] })
}
