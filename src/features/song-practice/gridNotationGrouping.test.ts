import { expect, it } from 'vitest'
import { groupedGridNotation } from './gridNotationGrouping'
import { blankBar } from './songChartLogic'
it('shows sparse grid hits as quarter/eighth symbols without changing onsets', () => {
 const bar = blankBar(); for (const step of [0, 4, 8, 12]) bar.Snare[step] = 2
 const grouped = groupedGridNotation(bar, 'quarter')
 expect(grouped.rhythmEvents!.filter((event) => event.kind === 'note').map((event) => event.duration)).toEqual([4, 4, 4, 4])
 expect('rhythmEvents' in bar).toBe(false); expect(grouped.Snare).toEqual(bar.Snare)
 expect(groupedGridNotation(bar, 'eighth').rhythmEvents![0].duration).toBe(2)
})
it('never swallows dense onsets or overrides reviewed durations', () => {
 const bar = blankBar(); bar.Snare.fill(2)
 const grouped = groupedGridNotation(bar, 'quarter')
 expect(grouped.rhythmEvents!.filter((event) => event.kind === 'note')).toHaveLength(16)
 expect(grouped.rhythmEvents!.every((event) => event.duration === 1)).toBe(true)
 expect(groupedGridNotation(grouped, 'eighth')).toBe(grouped)
})
