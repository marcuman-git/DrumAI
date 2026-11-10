import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'
import { CandidateNavigator } from './CandidateNavigator'
import type { NoteCandidate } from './notationRecognition'
afterEach(cleanup)
const notes: NoteCandidate[] = [3, 9].map((id) => ({ id, x: 20, y: 55, instrument: 'Snare', shape: 'oval', strength: 0.9, stemHint: false, flagHint: false }))
it('navigates using real candidate ids, without accepting or mapping them', () => {
  const onFocus = vi.fn(); const onAccept = vi.fn(); const onMap = vi.fn()
  const props = { notes, accepted: [], hints: {}, focusedId: null, onFocus, onAccept, onMap }
  const view = render(<CandidateNavigator {...props} />)
  expect(screen.getByRole('button', { name: 'Previous candidate' })).toBeDisabled()
  fireEvent.click(screen.getByRole('button', { name: 'Next candidate' }))
  expect(onFocus).toHaveBeenLastCalledWith(3)
  view.rerender(<CandidateNavigator {...props} focusedId={3} />)
  fireEvent.click(screen.getByRole('button', { name: 'Next candidate' }))
  expect(onFocus).toHaveBeenLastCalledWith(9)
  fireEvent.change(screen.getByLabelText('Jump to candidate'), { target: { value: '9' } })
  expect(onFocus).toHaveBeenLastCalledWith(9)
  expect(onAccept).not.toHaveBeenCalled(); expect(onMap).not.toHaveBeenCalled()
  view.rerender(<CandidateNavigator {...props} focusedId={9} />)
  expect(screen.getByRole('button', { name: 'Next candidate' })).toBeDisabled()
  fireEvent.click(screen.getByRole('button', { name: 'Previous candidate' }))
  expect(onFocus).toHaveBeenLastCalledWith(3)
})
it('handles an empty scan without navigation crashes', () => {
  render(<CandidateNavigator notes={[]} accepted={[]} hints={{}} focusedId={null} onFocus={vi.fn()} onAccept={vi.fn()} onMap={vi.fn()} />)
  expect(screen.getByRole('button', { name: 'Next candidate' })).toBeDisabled()
  expect(screen.getByRole('button', { name: 'Previous candidate' })).toBeDisabled()
})
it('preserves hidden selections and navigates the filtered list only', () => {
  const onFocus = vi.fn(); const onAccept = vi.fn()
  render(<CandidateNavigator notes={notes} accepted={[3]} hints={{}} focusedId={3} onFocus={onFocus} onAccept={onAccept} onMap={vi.fn()} />)
  fireEvent.change(screen.getByLabelText('Candidate filter'), { target: { value: 'unchecked' } })
  expect(screen.queryByTestId('candidate-row-3')).toBeNull()
  expect(screen.getByTestId('candidate-row-9')).toBeInTheDocument()
  expect(screen.getByText(/hidden by this filter/)).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Next candidate' }))
  expect(onFocus).toHaveBeenLastCalledWith(9)
  fireEvent.click(screen.getByRole('button', { name: 'Show all candidates' }))
  expect(screen.getAllByRole('checkbox', { name: /Snare, x=20/ })[0]).toBeChecked()
  expect(onAccept).not.toHaveBeenCalled()
})
it('filters by instrument without clearing hidden checked rows', () => {
  const onAccept = vi.fn()
  const kitNotes: NoteCandidate[] = [{ ...notes[0], instrument: 'Floor tom 1' }, { ...notes[1], instrument: 'Open hi-hat' }]
  render(<CandidateNavigator notes={kitNotes} accepted={[3, 9]} hints={{}} focusedId={3} onFocus={vi.fn()} onAccept={onAccept} onMap={vi.fn()} />)
  fireEvent.change(screen.getByLabelText('Instrument filter'), { target: { value: 'Open hi-hat' } })
  expect(screen.queryByTestId('candidate-row-3')).toBeNull()
  expect(screen.getByTestId('candidate-row-9')).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Show all candidates' }))
  expect(screen.getByRole('checkbox', { name: /Floor tom 1, x=20/ })).toBeChecked()
  expect(onAccept).not.toHaveBeenCalled()
})
