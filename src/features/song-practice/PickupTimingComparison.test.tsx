import {cleanup,fireEvent,render,screen} from '@testing-library/react'
import {afterEach,expect,it,vi} from 'vitest'
import {PickupTimingComparison} from './PickupTimingComparison'
import {blankBar} from './songChartLogic'
afterEach(cleanup)
it('compares timing only after source review and resets on bar/reference changes',()=>{
 const bar=blankBar();bar.Snare[12]=2;const onInspectSource=vi.fn()
 const props={bar,source:'score.pdf',page:2,onInspectSource}
 const {rerender}=render(<PickupTimingComparison {...props}/>);fireEvent.click(screen.getByText('Compare first-bar pickup timing'))
 expect(screen.getByLabelText('Pickup comparison offset')).toBeDisabled()
 fireEvent.click(screen.getByRole('button',{name:'Inspect pickup source'}));expect(onInspectSource).toHaveBeenCalledWith({source:'score.pdf',page:2,crop:undefined})
 fireEvent.click(screen.getByLabelText('Verify pickup source'));fireEvent.change(screen.getByLabelText('Pickup comparison offset'),{target:{value:'12'}})
 expect(screen.getByRole('status')).toHaveTextContent('full bar 4.00 seconds; compared timing 1.00 seconds')
 fireEvent.change(screen.getByLabelText('Pickup comparison tempo'),{target:{value:'120'}});expect(screen.getByRole('status')).toHaveTextContent('compared timing 0.50 seconds')
 expect(bar.Snare[12]).toBe(2);expect(bar).not.toHaveProperty('pickupOffset')
 rerender(<PickupTimingComparison {...props} page={3}/>);expect(screen.getByLabelText('Verify pickup source')).not.toBeChecked();expect(screen.getByLabelText('Pickup comparison offset')).toHaveValue('0')
 rerender(<PickupTimingComparison {...props}/>);expect(screen.getByLabelText('Verify pickup source')).not.toBeChecked()
 fireEvent.click(screen.getByLabelText('Verify pickup source'));const changed=structuredClone(bar);changed.Kick[0]=2;rerender(<PickupTimingComparison {...props} bar={changed}/>);expect(screen.getByLabelText('Pickup comparison offset')).toBeDisabled()
})
it('does not offer shortening for a silent bar',()=>{render(<PickupTimingComparison bar={blankBar()}/>);fireEvent.click(screen.getByText('Compare first-bar pickup timing'));fireEvent.click(screen.getByLabelText('Verify pickup source'));expect(screen.getByLabelText('Pickup comparison offset')).toBeDisabled();expect(screen.getByRole('status')).toHaveTextContent('compared timing 4.00 seconds')})
it('emits a verified transfer only for the current source reference',()=>{const bar=blankBar();bar.Snare[12]=2;const onPickupChange=vi.fn(),view=render(<PickupTimingComparison bar={bar} source="study.pdf" page={2} onPickupChange={onPickupChange}/>);fireEvent.click(screen.getByText('Compare first-bar pickup timing'));fireEvent.click(screen.getByLabelText('Verify pickup source'));fireEvent.change(screen.getByLabelText('Pickup comparison offset'),{target:{value:'12'}});expect(onPickupChange.mock.calls.at(-1)?.[0].offset).toBe(12);view.rerender(<PickupTimingComparison bar={bar} source="study.pdf" page={3} onPickupChange={onPickupChange}/>);expect(onPickupChange).toHaveBeenLastCalledWith(null)})
