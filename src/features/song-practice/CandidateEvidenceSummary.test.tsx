import {cleanup,fireEvent,render,screen} from '@testing-library/react'
import {afterEach,expect,it,vi} from 'vitest'
import {CandidateEvidenceSummary} from './CandidateEvidenceSummary'
afterEach(cleanup)
it('counts checked warnings independently and focuses without changing selections',()=>{const notes=[{id:0,x:10,y:20,shape:'oval' as const,instrument:'Snare' as const,strength:1,stemHint:true,flagHint:false},{id:1,x:50,y:20,shape:'cross' as const,instrument:'Ride' as const,strength:1,stemHint:true,flagHint:false,symbolHint:'circled-cross' as const}],accepted=[0],onFocus=vi.fn();render(<CandidateEvidenceSummary notes={notes} accepted={accepted} hints={{}} onFocus={onFocus}/>);fireEvent.click(screen.getByText('Evidence review: 1 checked candidates have review guidance'));fireEvent.click(screen.getByRole('button',{name:'Inspect evidence #2'}));expect(onFocus).toHaveBeenCalledWith(1);expect(accepted).toEqual([0]);expect(notes[1].instrument).toBe('Ride')})
