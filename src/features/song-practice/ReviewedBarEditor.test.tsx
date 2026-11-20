import { afterEach,expect,it,vi } from 'vitest'
import { cleanup,fireEvent,render,screen,within } from '@testing-library/react'
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

it('undoes and redoes invalid drafts, clears verification, drops redo branches and resets history on discard',()=>{
 render(<ReviewedBarEditor chart={fixture()} index={0} disabled={false} onApply={vi.fn()}/>);fireEvent.click(screen.getByText(/Edit reviewed durations — Bar 1/))
 fireEvent.change(screen.getByLabelText('Reviewed event 1 duration'),{target:{value:'3'}})
 fireEvent.click(screen.getByRole('button',{name:'Undo draft edit'}));expect(screen.getByLabelText('Reviewed event 1 duration')).toHaveValue('2')
 fireEvent.click(screen.getByRole('button',{name:'Redo draft edit'}));expect(screen.getByLabelText('Reviewed event 1 duration')).toHaveValue('3');expect(screen.getByRole('button',{name:'Apply reviewed duration edits'})).toBeDisabled()
 fireEvent.click(screen.getByRole('button',{name:'Undo draft edit'}))
 fireEvent.change(screen.getByLabelText('Reviewed event 1 dynamic'),{target:{value:'3'}});expect(screen.getByRole('button',{name:'Redo draft edit'})).toBeDisabled()
 fireEvent.click(screen.getByLabelText('Verify edited durations against source'));fireEvent.click(screen.getByRole('button',{name:'Undo draft edit'}));expect(screen.getByLabelText('Verify edited durations against source')).not.toBeChecked()
 fireEvent.click(screen.getByRole('button',{name:'Redo draft edit'}));expect(screen.getByLabelText('Verify edited durations against source')).not.toBeChecked()
 fireEvent.click(screen.getByRole('button',{name:'Discard reviewed duration edits'}));expect(screen.getByRole('button',{name:'Undo draft edit'})).toBeDisabled();expect(screen.getByRole('button',{name:'Redo draft edit'})).toBeDisabled()
})

it('navigates a reviewed event to its original crop and head location without changing the draft',()=>{const chart=fixture();chart.review={source:'study.pdf',bars:[{status:'Pending',page:2,notes:'',signature:'',crops:[{page:2,region:{x:.1,y:.2,width:.4,height:.2}}]}]};chart.bars[0].rhythmEvents![0].sourceAnchor={page:2,x:.3,y:.3};const onSourceReference=vi.fn(),onApply=vi.fn();render(<ReviewedBarEditor chart={chart} index={0} disabled={false} onApply={onApply} onSourceReference={onSourceReference}/>);fireEvent.click(screen.getByText(/Edit reviewed durations — Bar 1/));fireEvent.click(screen.getByRole('button',{name:'View source for event 1'}));expect(onSourceReference).toHaveBeenCalledWith({source:'study.pdf',page:2,crop:chart.review.bars[0].crops![0],point:{page:2,x:.3,y:.3}});expect(onApply).not.toHaveBeenCalled()})

it('focuses diagnostics in the correct editor when two reviewed bars are shown',()=>{const chart=fixture();chart.bars.push(structuredClone(chart.bars[0]));render(<><ReviewedBarEditor chart={chart} index={0} disabled={false} onApply={vi.fn()}/><ReviewedBarEditor chart={chart} index={1} disabled={false} onApply={vi.fn()}/></>);const editors=screen.getAllByLabelText('Edit reviewed bar durations');fireEvent.click(within(editors[1]).getByText(/Edit reviewed durations — Bar 2/));fireEvent.change(within(editors[1]).getByLabelText('Reviewed event 1 duration'),{target:{value:'6'}});fireEvent.click(within(editors[1]).getByRole('button',{name:'Inspect event 1'}));expect(within(editors[1]).getByLabelText('Reviewed event 1 slot')).toHaveFocus();expect(within(editors[0]).getByLabelText('Reviewed event 1 slot')).not.toHaveFocus()})
