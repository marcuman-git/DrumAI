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
it('places simultaneous instruments on one five-line staff', () => {
  const bar = blankBar(); bar['Hi-hat'][0] = 2; bar.Snare[0] = 2; bar.Kick[0] = 2
  render(<ChartStaffNotation bar={bar} barNumber={1} activeStep={0} />)
  const svg = screen.getByRole('img', { name: 'Bar 1 drum notation' })
  expect(svg.querySelectorAll('line')).toHaveLength(7)
  expect(screen.getByTestId('staff-Hi-hat-0')).toHaveAttribute('data-active', 'true')
  expect(screen.getByTestId('staff-Snare-0')).toHaveAttribute('data-active', 'true')
  expect(screen.getByTestId('staff-Kick-0')).toHaveAttribute('data-active', 'true')
})
it('renders distinct cymbal heads on the same staff', () => {
  const bar = blankBar(); bar.Crash[0] = 2; bar.Ride[4] = 3
  render(<ChartStaffNotation bar={bar} barNumber={1} activeStep={4} />)
  expect(screen.getByTestId('staff-Crash-0')).toHaveAttribute('aria-label', 'Crash slot 1: sixteenth note')
  expect(screen.getByTestId('staff-Crash-0').querySelector('circle')).not.toBeNull()
  expect(screen.getByTestId('staff-Ride-4')).toHaveAttribute('data-active', 'true')
})
it('renders floor/rack toms, second bass and pedal hi-hat without separate staves', () => {
  const bar=blankBar(); bar['Tom 1'][0]=2; bar['Floor tom 2'][0]=2; bar['Kick 2'][0]=2; bar['Pedal hi-hat'][0]=2
  render(<ChartStaffNotation bar={bar} barNumber={1} activeStep={0} />)
  expect(screen.getByTestId('staff-Tom 1-0').querySelector('ellipse')).not.toBeNull()
  expect(screen.getByTestId('staff-Kick 2-0')).toHaveAttribute('data-active','true')
  expect(screen.getByTestId('staff-Pedal hi-hat-0').querySelector('ellipse')).toBeNull()
})
it('renders reviewed durations without extra flags or continuation rests', async () => {
  const { reviewedBar, fillReviewedRests } = await import('./reviewedRhythm')
  const bar = reviewedBar(fillReviewedRests([{ instrument: 'Snare', step: 0, duration: 4, kind: 'note', dynamic: 2 }], 'Snare'))
  render(<ChartStaffNotation bar={bar} barNumber={1} activeStep={0} />)
  expect(screen.getByLabelText('Snare slot 1: quarter note')).toBeInTheDocument()
  expect(screen.getByTestId('review-stem-Snare-0').getAttribute('d')).not.toContain('q')
  expect(screen.queryByTestId('review-rest-Snare-1')).not.toBeInTheDocument()
  expect(screen.getByTestId('review-rest-Snare-4')).toBeInTheDocument()
})
