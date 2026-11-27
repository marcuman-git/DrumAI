import {cleanup,fireEvent,render,screen} from '@testing-library/react'
import {afterEach,expect,it,vi} from 'vitest'
import {ConversionComparison} from './ConversionComparison'
import {completeBar} from './chartKit'
import type {NoteCandidate} from './notationRecognition'
afterEach(cleanup)
it('highlights shifted source heads and navigates to the correct candidate without editing the draft',()=>{const note:NoteCandidate={id:4,x:85,y:30,instrument:'Hi-hat',shape:'cross',strength:1,stemHint:true,flagHint:false},bar=completeBar(),onInspect=vi.fn();bar['Hi-hat'][3]=2;const before=structuredClone(bar);render(<ConversionComparison notes={[note]} events={[]} draft={bar} planned={{4:2}} onInspect={onInspect}/>);expect(screen.getByRole('status')).toHaveTextContent('shifted 1');fireEvent.click(screen.getByRole('button',{name:'#5 Hi-hat, x=85'}));expect(onInspect).toHaveBeenCalledWith(4);expect(bar).toEqual(before)})
it('filters matched heads while keeping conversion issues and their source navigation',()=>{
 const a:NoteCandidate={id:0,x:20,y:30,instrument:'Hi-hat',shape:'cross',strength:1,stemHint:true,flagHint:false},b={...a,id:1,x:50},bar=completeBar();bar['Hi-hat'][0]=2
 render(<ConversionComparison notes={[a,b]} events={[]} draft={bar} planned={{0:0,1:2}} onInspect={vi.fn()}/>);
 fireEvent.click(screen.getByLabelText('Show only conversion issues'))
 expect(screen.queryByRole('button',{name:'#1 Hi-hat, x=20'})).not.toBeInTheDocument()
 expect(screen.getByRole('button',{name:'#2 Hi-hat, x=50'})).toBeInTheDocument()
})
