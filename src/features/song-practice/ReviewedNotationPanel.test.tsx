import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'
import { ReviewedNotationPanel } from './ReviewedNotationPanel'
afterEach(cleanup)
it('requires full rhythm and explicit confirmation before passing a reviewed bar', () => {
  const onConfirm = vi.fn()
  render(<ReviewedNotationPanel notes={[]} hints={{}} first={0} last={150} image={null} staff={null} onConfirm={onConfirm} />)
  expect(screen.getByRole('button', { name: 'Confirm reviewed bar' })).toBeDisabled()
  fireEvent.click(screen.getByRole('button', { name: 'Add reviewed note' }))
  fireEvent.change(screen.getByLabelText('Event 1 duration'), { target: { value: '4' } })
  fireEvent.click(screen.getByRole('button', { name: 'Fill gaps with manual rests' }))
  fireEvent.click(screen.getByRole('checkbox', { name: /I verified every onset/ }))
  fireEvent.click(screen.getByRole('button', { name: 'Confirm reviewed bar' }))
  expect(onConfirm.mock.calls[0][0].rhythmEvents[0].duration).toBe(4)
  fireEvent.change(screen.getByLabelText('Event 1 slot'), { target: { value: '2' } })
  expect(screen.getByRole('button', { name: 'Confirm reviewed bar' })).toBeDisabled()
})
