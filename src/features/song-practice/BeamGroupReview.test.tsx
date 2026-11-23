import {cleanup,fireEvent,render,screen} from '@testing-library/react'
import {afterEach,expect,it,vi} from 'vitest'
import {BeamGroupReview} from './BeamGroupReview'
import type {NoteCandidate} from './notationRecognition'
import type {NoteValueHint} from './noteValueHints'
import type {RhythmEvent} from './rhythmTypes'
afterEach(cleanup)
it('retains mixed durations until a group change is explicitly selected',()=>{const notes:NoteCandidate[]=[0,1].map(id=>({id,x:20+id*20,y:40,instrument:'Snare',shape:'oval',strength:1,stemHint:true,flagHint:false})),base:NoteValueHint={value:'eighth',beamBands:1,stemDirection:'up',left:0,top:0,width:1,height:1},hints={0:{...base,contextNeighbours:[1]},1:{...base,value:'sixteenth' as const,contextNeighbours:[0]}},events:RhythmEvent[]=notes.map(n=>({sourceCandidateId:n.id,instrument:n.instrument,step:n.id*4,duration:n.id?1:2,kind:'note',dynamic:2})),onApply=vi.fn();render(<BeamGroupReview notes={notes} hints={hints} events={events} onApply={onApply}/>);expect(screen.getByText(/Mixed duration hints/)).toBeVisible();expect(onApply).not.toHaveBeenCalled();fireEvent.change(screen.getByLabelText('Beam group 1 duration'),{target:{value:'2'}});expect(onApply.mock.calls[0][0].map((e:RhythmEvent)=>e.duration)).toEqual([2,2]);expect(events[1].duration).toBe(1)})
