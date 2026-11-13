import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'
import { CandidateNavigator } from './CandidateNavigator'
import { RhythmReview } from './RhythmReview'
import type { NoteCandidate } from './notationRecognition'
const notes: NoteCandidate[] = [{ id: 0, x: 20, y: 30, instrument: 'Snare', shape: 'oval', strength: 1, stemHint: false, flagHint: false }]
afterEach(cleanup)
it('offers review filtering without silently checking or remapping candidates', () => {
 const onAccept = vi.fn(); const onMap = vi.fn()
 render(<CandidateNavigator notes={notes} accepted={[0]} hints={{}} focusedId={null} onFocus={vi.fn()} onAccept={onAccept} onMap={onMap} />)
 fireEvent.change(screen.getByLabelText('Candidate filter'), { target: { value: 'review' } })
 expect(screen.getByText('Duration uncertain')).toBeVisible()
 expect(screen.getByRole('checkbox')).toBeChecked()
 expect(onAccept).not.toHaveBeenCalled(); expect(onMap).not.toHaveBeenCalled()
})
it('summarizes checked candidates needing review without altering chart data', () => {
 render(<RhythmReview notes={notes} hints={{}} first={20} last={170} />)
 expect(screen.getByText(/Checked candidates needing review: 1/)).toBeVisible()
})
it('offers a ledger-cross Crash correction without automatic instrument remapping', () => {
 const onMap = vi.fn(); const onAccept = vi.fn()
 render(<CandidateNavigator notes={[{ ...notes[0], instrument: 'Hi-hat', cymbalHint: 'ledger-cross' }]} accepted={[0]} hints={{}} focusedId={null} onFocus={vi.fn()} onAccept={onAccept} onMap={onMap} />)
 expect(onMap).not.toHaveBeenCalled()
 fireEvent.click(screen.getByRole('button', { name: 'Map candidate 1 to Crash' }))
 expect(onMap).toHaveBeenCalledWith(0, 'Crash')
 expect(onAccept).not.toHaveBeenCalled()
})
