import { useCallback, useReducer } from 'react'
import type { SetStateAction } from 'react'
import type { SongChart } from './songChartLogic'
import { newSongChart } from './songChartLogic'
interface History { past: SongChart[]; present: SongChart; future: SongChart[] }
type Action = { type: 'edit'; update: SetStateAction<SongChart> } | { type: 'reset'; chart: SongChart } | { type: 'undo' } | { type: 'redo' }
export function chartHistoryReducer(state: History, action: Action): History {
  if (action.type === 'reset') return { past: [], present: action.chart, future: [] }
  if (action.type === 'undo') {
    if (!state.past.length) return state
    return { past: state.past.slice(0, -1), present: state.past[state.past.length - 1], future: [state.present, ...state.future] }
  }
  if (action.type === 'redo') {
    if (!state.future.length) return state
    return { past: [...state.past, state.present].slice(-50), present: state.future[0], future: state.future.slice(1) }
  }
  const next = typeof action.update === 'function' ? action.update(state.present) : action.update
  if (JSON.stringify(next) === JSON.stringify(state.present)) return state
  return { past: [...state.past, state.present].slice(-50), present: next, future: [] }
}
export function useChartHistory() {
  const [history, dispatch] = useReducer(chartHistoryReducer, undefined, () => ({ past: [], present: newSongChart(), future: [] }))
  const setChart = useCallback((update: SetStateAction<SongChart>) => dispatch({ type: 'edit', update }), [])
  return { chart: history.present, setChart, canUndo: history.past.length > 0, canRedo: history.future.length > 0, undo: () => dispatch({ type: 'undo' }), redo: () => dispatch({ type: 'redo' }), resetChart: (chart: SongChart) => dispatch({ type: 'reset', chart }) }
}
