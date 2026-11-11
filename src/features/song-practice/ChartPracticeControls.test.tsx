import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'
import { ChartPracticeControls } from './ChartPracticeControls'
import { newSongChart } from './songChartLogic'
import { defaultMix } from './chartPracticeSettings'
afterEach(cleanup)
it('hides mix controls without changing hidden notes or mix settings', () => {
 const chart = newSongChart(); chart.mix = defaultMix(); chart.mix.Kick.solo = true
 const setChart = vi.fn()
 const view = render(<ChartPracticeControls chart={chart} setChart={setChart} playing={false} cycles={0} instruments={['Snare']} />)
 expect(screen.getByLabelText('Snare mute')).toBeVisible()
 expect(screen.queryByLabelText('Kick mute')).toBeNull()
 expect(setChart).not.toHaveBeenCalled()
 view.rerender(<ChartPracticeControls chart={chart} setChart={setChart} playing={false} cycles={0} />)
 expect(screen.getByLabelText('Kick solo')).toHaveAttribute('aria-pressed', 'true')
 expect(chart.bars[0].Kick[0]).toBe(2)
})
