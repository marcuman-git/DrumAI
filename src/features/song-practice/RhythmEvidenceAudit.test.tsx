import {cleanup,fireEvent,render,screen} from '@testing-library/react'
import {afterEach,expect,it,vi} from 'vitest'
import {RhythmEvidenceAudit} from './RhythmEvidenceAudit'
afterEach(cleanup)
it('offers event inspection without rewriting a dotted reviewed duration',()=>{const events=[{instrument:'Snare' as const,step:0,duration:3 as const,kind:'note' as const,dynamic:2 as const}],onInspect=vi.fn();render(<RhythmEvidenceAudit events={events} onInspect={onInspect}/>);fireEvent.click(screen.getByText('Compare rhythm evidence: 1 event(s) have guidance'));fireEvent.click(screen.getByRole('button',{name:'Inspect rhythm event 1'}));expect(onInspect).toHaveBeenCalledWith(0);expect(events[0].duration).toBe(3)})
