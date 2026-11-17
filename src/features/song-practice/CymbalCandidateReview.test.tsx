import {cleanup,fireEvent,render,screen} from '@testing-library/react'
import {afterEach,expect,it,vi} from 'vitest'
import {CymbalCandidateReview} from './CymbalCandidateReview'
import type {NoteCandidate} from './notationRecognition'
afterEach(cleanup)
const note:NoteCandidate={id:4,x:40,y:30,instrument:'Crash',shape:'cross',strength:1,stemHint:false,flagHint:false,symbolHint:'circled-cross'}
it('requires deliberate mapping or inspection while warning about unsupported circled identities',()=>{
 const onMap=vi.fn();const onFocus=vi.fn()
 render(<CymbalCandidateReview note={note} onMap={onMap} onFocus={onFocus}/>)
 expect(screen.getByText(/Leave unchecked/)).toBeVisible();expect(onMap).not.toHaveBeenCalled()
 fireEvent.click(screen.getByRole('button',{name:'Inspect cymbal 5'}));expect(onFocus).toHaveBeenCalledWith(4)
 fireEvent.click(screen.getByRole('button',{name:'Use Ride for candidate 5'}));expect(onMap).toHaveBeenCalledWith(4,'Ride')
})
it('offers comparison for ambiguous positions and hides the panel for oval heads',()=>{
 const props={onMap:vi.fn(),onFocus:vi.fn()}
 const view=render(<CymbalCandidateReview note={{...note,symbolHint:undefined,positionHint:'ambiguous'}} {...props}/>)
 expect(screen.getByText(/Compare Hi-hat and Ride/)).toBeVisible()
 view.rerender(<CymbalCandidateReview note={{...note,symbolHint:undefined,positionHint:'on-line',shape:'oval'}} {...props}/>)
 expect(screen.queryByLabelText('Cymbal review candidate 5')).toBeNull()
})
