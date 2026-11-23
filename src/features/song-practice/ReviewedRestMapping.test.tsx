import {cleanup,fireEvent,render,screen} from '@testing-library/react'
import {afterEach,expect,it,vi} from 'vitest'
import {ReviewedNotationPanel} from './ReviewedNotationPanel'
const duration=vi.hoisted(()=>({value:2}))
vi.mock('./restRecognition',()=>({detectRestHints:()=>[{id:0,x:100,y:60,duration:duration.value,strength:1}]}))
afterEach(cleanup)
it.each([[2,14],[4,12]])('maps a %s-slot rest using the selected onset guides rather than the final sixteenth slot',(value,lastGuideStep)=>{duration.value=value;render(<ReviewedNotationPanel notes={[]} hints={{}} first={0} last={100} slots={16} lastGuideStep={lastGuideStep} image={{width:120,height:100,ink:new Uint8Array(12000),angle:0,staffs:[]}} staff={{top:40,gap:10}} onConfirm={vi.fn()}/>);fireEvent.click(screen.getByRole('button',{name:'Detect rest hints (Experimental)'}));fireEvent.click(screen.getByRole('button',{name:'Accept rest hint for review'}));expect(screen.getByLabelText('Event 1 slot')).toHaveValue(lastGuideStep+1);expect(screen.getByLabelText('Event 1 duration')).toHaveValue(String(value))})
