import { afterEach,expect,it,vi } from 'vitest'
import { cleanup,fireEvent,render,screen } from '@testing-library/react'
import { ReviewedBarEditor } from './ReviewedBarEditor'
import { reviewedBar } from './reviewedRhythm'
import { newSongChart } from './songChartLogic'
import { setBoundaryTie } from './chartTieReview'
import type { RhythmEvent } from './rhythmTypes'
afterEach(cleanup)
const events:RhythmEvent[]=[{instrument:'Snare',step:0,duration:2,kind:'note',dynamic:2},{instrument:'Snare',step:2,duration:2,kind:'rest',dynamic:2},{instrument:'Snare',step:4,duration:4,kind:'note',dynamic:2}]
function fixture(){return {...newSongChart(),meter:'2/4' as const,bars:[reviewedBar(events,8)]}}
it('keeps invalid edits local, diagnoses overlaps and applies only a source-verified valid draft',()=>{
 const chart=fixture(),onApply=vi.fn();render(<ReviewedBarEditor chart={chart} index={0} disabled={false} onApply={onApply}/>);fireEvent.click(screen.getByText(/Edit reviewed durations — Bar 1/))
 fireEvent.change(screen.getByLabelText('Reviewed event 1 duration'),{target:{value:'3'}})
 expect(screen.getByLabelText('Reviewed edit diagnostics')).toHaveTextContent('overlaps 3')
 expect(screen.getByRole('button',{name:'Apply reviewed duration edits'})).toBeDisabled();expect(onApply).not.toHaveBeenCalled();expect(chart.bars[0].rhythmEvents![0].duration).toBe(2)
 fireEvent.change(screen.getByLabelText('Reviewed event 2 slot'),{target:{value:'4'}})
 fireEvent.change(screen.getByLabelText('Reviewed event 2 duration'),{target:{value:'1'}})
 fireEvent.click(screen.getByLabelText('Verify edited durations against source'))
 fireEvent.click(screen.getByRole('button',{name:'Apply reviewed duration edits'}))
 expect(onApply).toHaveBeenCalledTimes(1);expect(onApply.mock.calls[0][0].bars[0].rhythmEvents[0].duration).toBe(3)
 fireEvent.change(screen.getByLabelText('Reviewed event 1 dynamic'),{target:{value:'3'}})
 expect(screen.getByLabelText('Verify edited durations against source')).not.toBeChecked()
})
it('requires source acknowledgement before turning a next-bar tied continuation into a fresh strike',()=>{
 const chart=fixture();chart.bars.push(reviewedBar(events,8));const tied=setBoundaryTie(chart,1,'Snare',true),onApply=vi.fn()
 render(<ReviewedBarEditor chart={tied} index={0} disabled={false} onApply={onApply}/>);fireEvent.click(screen.getByText(/Edit reviewed durations — Bar 1/))
 fireEvent.change(screen.getByLabelText('Reviewed event 3 kind'),{target:{value:'rest'}})
 expect(screen.getByRole('alert')).toHaveTextContent('next-bar ties: Snare')
 expect(screen.getByLabelText('Verify edited durations against source')).toBeDisabled()
 fireEvent.click(screen.getByLabelText('Detach affected next-bar ties'));fireEvent.click(screen.getByLabelText('Verify edited durations against source'))
 fireEvent.click(screen.getByRole('button',{name:'Apply reviewed duration edits'}));expect(onApply.mock.calls[0][0].bars[1].Snare[0]).toBe(2)
})
it('discards local changes and disables duration review during playback',()=>{
 const chart=fixture(),onApply=vi.fn(),view=render(<ReviewedBarEditor chart={chart} index={0} disabled={false} onApply={onApply}/>);fireEvent.click(screen.getByText(/Edit reviewed durations — Bar 1/))
 fireEvent.change(screen.getByLabelText('Reviewed event 1 duration'),{target:{value:'3'}});fireEvent.click(screen.getByRole('button',{name:'Discard reviewed duration edits'}));expect(screen.getByLabelText('Reviewed event 1 duration')).toHaveValue('2');expect(onApply).not.toHaveBeenCalled()
 view.rerender(<ReviewedBarEditor chart={chart} index={0} disabled={true} onApply={onApply}/>);expect(screen.getByLabelText('Reviewed event 1 duration')).toBeDisabled()
})
