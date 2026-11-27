import {expect,it} from 'vitest'
import {distinctCandidateSelection} from './distinctCandidateSelection'
import {durationEvidenceChoices} from './durationEvidenceChoices'
import type {NoteCandidate} from './notationRecognition'
import type {NoteValueHint} from './noteValueHints'
const head={id:0,x:20,y:20,shape:'cross',instrument:'Hi-hat',strength:.9,stemHint:true,flagHint:false} as NoteCandidate
it('offers one selection for a competing identity on the same head while retaining stacked and adjacent heads',()=>{
 const report=distinctCandidateSelection([head,{...head,id:1,instrument:'Ride',x:21,strength:.8},{...head,id:2,y:30},{...head,id:3,x:30}],10)
 expect(report.ids).toEqual([0,2,3]);expect(report.excluded).toEqual([{id:1,kept:0}])
})
it('shows dotted and conflicting flag alternatives without assigning a duration',()=>{
 const hint={value:'unknown',stemDirection:'up',beamBands:1,flagBands:2,possibleDot:true} as NoteValueHint
 expect(durationEvidenceChoices(hint).map(c=>c.value)).toEqual([3,2,1.5,1]);expect(hint.value).toBe('unknown')
 expect(durationEvidenceChoices({...hint,possibleDot:false,beamBands:3,flagBands:0}).map(c=>c.value)).toEqual([.5])
 expect(durationEvidenceChoices({...hint,manualReviewed:true})).toEqual([])
})

import {competingHeadIssues} from './distinctCandidateSelection'
it('blocks turning a single checked physical head into competing instrument attacks',()=>{
 expect(competingHeadIssues([head,{...head,id:1,instrument:'Ride'}])).toHaveLength(1)
 expect(competingHeadIssues([head,{...head,id:1,instrument:'Ride',y:30}])).toEqual([])
})
