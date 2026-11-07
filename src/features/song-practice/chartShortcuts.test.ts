import { describe, expect, it } from 'vitest'
import { patternRow, replaceChartBar, replaceChartRow } from './chartShortcuts'
import { newSongChart, blankBar } from './songChartLogic'
describe('chart shortcuts', () => {
  it('generates quarter, eighth, sixteenth and offbeat rows', () => {
    expect(patternRow('Quarter notes').filter(Boolean)).toHaveLength(4)
    expect(patternRow('Eighth notes').filter(Boolean)).toHaveLength(8)
    expect(patternRow('Sixteenth notes').filter(Boolean)).toHaveLength(16)
    expect(patternRow('Clear').filter(Boolean)).toHaveLength(0)
    expect(patternRow('Offbeat eighths').flatMap((note, index) => note ? [index] : [])).toEqual([2, 6, 10, 14])
  })
  it('replaces without sharing arrays or changing range, tempo, or other bars', () => {
    const chart = { ...newSongChart(), bars: [blankBar(), blankBar()], section: { start: 1, end: 1 }, barLabels: ['A', 'B'] }
    const copied = newSongChart().bars[0]
    const next = replaceChartBar(chart, 1, copied, 'Copied')
    copied.Kick[0] = 0
    expect(next.bars[1].Kick[0]).toBe(2)
    expect(next.bars[0]).toEqual(chart.bars[0])
    expect(next.section).toEqual(chart.section)
    expect(next.barLabels).toEqual(['A', 'Copied'])
    const row = patternRow('Quarter notes')
    const updated = replaceChartRow(next, 1, 'Snare', row)
    row[0] = 0
    expect(updated.bars[1].Snare[0]).toBe(2)
    expect(updated.bars[1].Kick).toEqual(next.bars[1].Kick)
  })
})
