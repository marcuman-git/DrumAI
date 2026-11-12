import { expect, it } from 'vitest'
import { createReviewHistory, reviewHistoryReducer, REVIEW_HISTORY_LIMIT } from './reviewEventHistory'
import type { RhythmEvent } from './rhythmTypes'
const event: RhythmEvent = { instrument: 'Snare', step: 0, duration: 1, kind: 'note', dynamic: 2 }
it('restores edits and bulk replacements without mutating snapshots', () => {
 const events = [{ ...event }]
 let history = reviewHistoryReducer(createReviewHistory(), { type: 'edit', events })
 events[0].step = 9
 expect(history.present[0].step).toBe(0)
 history = reviewHistoryReducer(history, { type: 'edit', events: [{ ...event, duration: 4 }] })
 history = reviewHistoryReducer(history, { type: 'undo' })
 expect(history.present[0].duration).toBe(1)
 history = reviewHistoryReducer(history, { type: 'redo' })
 expect(history.present[0].duration).toBe(4)
})
it('clears redo after a different edit but not after a no-op', () => {
 let history = reviewHistoryReducer(createReviewHistory(), { type: 'edit', events: [event] })
 history = reviewHistoryReducer(history, { type: 'undo' })
 const same = reviewHistoryReducer(history, { type: 'edit', events: [] })
 expect(same).toBe(history)
 history = reviewHistoryReducer(history, { type: 'edit', events: [{ ...event, instrument: 'Kick' }] })
 expect(history.future).toEqual([])
})
it('bounds history and safely handles empty undo/redo', () => {
 let history = createReviewHistory()
 expect(reviewHistoryReducer(history, { type: 'undo' })).toBe(history)
 expect(reviewHistoryReducer(history, { type: 'redo' })).toBe(history)
 for (let index = 0; index < 70; index++) history = reviewHistoryReducer(history, { type: 'edit', events: [{ ...event, step: index % 16 }] })
 expect(history.past).toHaveLength(REVIEW_HISTORY_LIMIT)
 for (let index = 0; index < 50; index++) history = reviewHistoryReducer(history, { type: 'undo' })
 expect(history.future).toHaveLength(REVIEW_HISTORY_LIMIT)
})
it('retains invalid rhythms for manual correction, not automatic approval', () => {
 let history = reviewHistoryReducer(createReviewHistory(), { type: 'edit', events: [{ ...event, step: 15, duration: 4 }] })
 history = reviewHistoryReducer(history, { type: 'undo' })
 history = reviewHistoryReducer(history, { type: 'redo' })
 expect(history.present[0].step + history.present[0].duration).toBe(19)
})
