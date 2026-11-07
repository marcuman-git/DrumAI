import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { ChartStaffNotation } from './ChartStaffNotation'
import { blankBar } from './songChartLogic'
afterEach(cleanup)
describe('chart staff notation', () => {
  it('renders all instruments and rests without an external notation renderer', () => {
    const bar = blankBar(); bar.Snare[0] = 1; bar.Kick[15] = 3
    render(<ChartStaffNotation bar={bar} barNumber={2} activeStep={15} />)
    expect(screen.getByRole('img', { name: 'Bar 2 drum notation' })).toBeInTheDocument()
    expect(screen.getByTestId('staff-Hi-hat-15')).toHaveAttribute('data-active', 'true')
    expect(screen.getByTestId('staff-Snare-0')).toHaveAttribute('aria-label', 'Snare slot 1: ghost sixteenth note')
    expect(screen.getByTestId('staff-Kick-15')).toHaveAttribute('aria-label', 'Kick slot 16: accented sixteenth note')
    expect(screen.getByTestId('staff-Hi-hat-0')).toHaveAttribute('aria-label', 'Hi-hat slot 1: sixteenth rest')
  })
  it('updates symbols and highlighting when props change', () => {
    const bar = blankBar()
    const view = render(<ChartStaffNotation bar={bar} barNumber={1} activeStep={0} />)
    const changed = { ...bar, Snare: [...bar.Snare] }; changed.Snare[4] = 2
    view.rerender(<ChartStaffNotation bar={changed} barNumber={1} activeStep={4} />)
    expect(screen.getByTestId('staff-Snare-4')).toHaveAttribute('data-active', 'true')
    expect(screen.getByTestId('staff-Snare-4')).toHaveAttribute('aria-label', 'Snare slot 5: sixteenth note')
    expect(screen.getByTestId('staff-Snare-0')).toHaveAttribute('data-active', 'false')
  })
})
it('fits the complete staff without a forced minimum width', () => {
  render(<ChartStaffNotation bar={blankBar()} barNumber={1} activeStep={-1} />)
  expect(screen.getByRole('img', { name: 'Bar 1 drum notation' })).toHaveClass('w-full', 'max-w-full')
  expect(screen.getByRole('img', { name: 'Bar 1 drum notation' })).not.toHaveClass('min-w-[1000px]')
})
