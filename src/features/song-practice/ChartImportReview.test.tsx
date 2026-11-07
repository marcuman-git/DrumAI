import { useState } from 'react'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { ChartImportReview } from './ChartImportReview'
import { newSongChart } from './songChartLogic'
afterEach(cleanup)
function Harness() { const [chart, setChart] = useState(newSongChart); return <ChartImportReview chart={chart} setChart={setChart} index={0} playing={false} /> }
describe('manual review panel', () => {
  it('tracks uncertainty and permits completion only after review', () => {
    render(<Harness />)
    fireEvent.click(screen.getByRole('button', { name: 'Start manual chart review' }))
    expect(screen.getByRole('button', { name: 'Finish manual review' })).toBeDisabled()
    fireEvent.click(screen.getByRole('button', { name: 'Flag bar uncertain' }))
    expect(screen.getByText('Reviewed bars: 0 / 1. Bar 1: Uncertain')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Mark bar reviewed' }))
    expect(screen.getByRole('button', { name: 'Finish manual review' })).toBeEnabled()
    fireEvent.click(screen.getByRole('button', { name: 'Finish manual review' }))
    expect(screen.getByText(/Review confirmation recorded/)).toBeInTheDocument()
  })
  it('does not allow review changes during playback', () => {
    render(<ChartImportReview chart={newSongChart()} setChart={() => undefined} index={0} playing />)
    expect(screen.getByRole('button', { name: 'Start manual chart review' })).toBeDisabled()
  })
})
