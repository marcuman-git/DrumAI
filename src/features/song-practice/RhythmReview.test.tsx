import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, expect, it } from 'vitest'
import { RhythmReview } from './RhythmReview'
import { reviewRhythm } from './rhythmReviewLogic'
import type { NoteCandidate } from './notationRecognition'
import type { NoteValueHint } from './noteValueHints'
afterEach(cleanup)
const note = (id: number, x: number, instrument: NoteCandidate['instrument'] = 'Snare'): NoteCandidate => ({ id, x, y: 70, instrument, shape: 'oval', strength: 1, stemHint: false, flagHint: false })
const hint = (value: NoteValueHint['value']): NoteValueHint => ({ value, stemDirection: 'up', beamBands: 0, left: 0, top: 0, width: 10, height: 20 })
it('flags duration conflicts, overflow and unknowns without mutating notes', () => {
  const notes = [note(1, 0), note(2, 10), note(3, 150), note(4, 80, 'Kick')]
  expect(reviewRhythm(notes, { 1: hint('quarter'), 2: hint('eighth'), 3: hint('quarter') }, 0, 150)).toEqual({ conflicts: 1, overflow: 1, unknown: 1, outside: 0, empty: 12 })
  expect(notes[0].x).toBe(0)
})
it('allows simultaneous voices and flags invalid/outside guides', () => {
  expect(reviewRhythm([note(1, 0), note(2, 0, 'Kick')], { 1: hint('quarter'), 2: hint('quarter') }, 0, 150).conflicts).toBe(0)
  expect(reviewRhythm([note(1, -1)], {}, 0, 150).outside).toBe(1)
  expect(reviewRhythm([note(1, 0)], {}, 20, 20).outside).toBe(1)
})
it('never claims empty slots are recognized PDF rests', () => {
  render(<RhythmReview notes={[]} hints={{}} first={0} last={150} />)
  expect(screen.getByText(/not recognized PDF rests/)).toBeInTheDocument()
})
