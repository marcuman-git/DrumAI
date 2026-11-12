import type { RhythmEvent } from './rhythmTypes'
export const REVIEW_HISTORY_LIMIT = 50
export interface ReviewEventHistory { past: RhythmEvent[][]; present: RhythmEvent[]; future: RhythmEvent[][] }
export type ReviewHistoryAction = { type: 'edit'; events: RhythmEvent[] } | { type: 'undo' } | { type: 'redo' }
const copy = (events: readonly RhythmEvent[]) => events.map((event) => ({ ...event }))
export function createReviewHistory(): ReviewEventHistory { return { past: [], present: [], future: [] } }
/** Keeps editable invalid rhythms too; validity and source confirmation are separate. */
export function reviewHistoryReducer(state: ReviewEventHistory, action: ReviewHistoryAction): ReviewEventHistory {
 if (action.type === 'edit') {
  if (JSON.stringify(state.present) === JSON.stringify(action.events)) return state
  return { past: [...state.past, copy(state.present)].slice(-REVIEW_HISTORY_LIMIT), present: copy(action.events), future: [] }
 }
 if (action.type === 'undo') {
  const previous = state.past[state.past.length - 1]
  return previous ? { past: state.past.slice(0, -1), present: copy(previous), future: [copy(state.present), ...state.future].slice(0, REVIEW_HISTORY_LIMIT) } : state
 }
 const next = state.future[0]
 return next ? { past: [...state.past, copy(state.present)].slice(-REVIEW_HISTORY_LIMIT), present: copy(next), future: state.future.slice(1) } : state
}
