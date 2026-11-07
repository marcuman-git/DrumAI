import { describe, expect, it } from 'vitest'
import { chartHistoryReducer } from './useChartHistory'
import { newSongChart } from './songChartLogic'
describe('chart edit history', () => {
  it('undoes, redoes, clears redo on new edits, and resets history', () => {
    const chart = newSongChart()
    let state = { past: [] as typeof chart[], present: chart, future: [] as typeof chart[] }
    state = chartHistoryReducer(state, { type: 'edit', update: (current) => ({ ...current, title: 'Edited' }) })
    state = chartHistoryReducer(state, { type: 'undo' }); expect(state.present.title).toBe(chart.title)
    state = chartHistoryReducer(state, { type: 'redo' }); expect(state.present.title).toBe('Edited')
    state = chartHistoryReducer(state, { type: 'undo' })
    state = chartHistoryReducer(state, { type: 'edit', update: (current) => ({ ...current, bpm: 80 }) })
    expect(state.future).toHaveLength(0)
    state = chartHistoryReducer(state, { type: 'reset', chart })
    expect(state.past).toHaveLength(0)
  })
  it('caps history at 50 changes and ignores no-op edits', () => {
    const chart = newSongChart()
    let state = { past: [] as typeof chart[], present: chart, future: [] as typeof chart[] }
    for (let i = 0; i < 60; i++) state = chartHistoryReducer(state, { type: 'edit', update: (current) => ({ ...current, title: `Edit ${i}` }) })
    expect(state.past).toHaveLength(50)
    expect(chartHistoryReducer(state, { type: 'edit', update: (current) => ({ ...current }) })).toBe(state)
  })
})
