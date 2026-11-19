import {expect,it} from 'vitest'
import {possibleDuplicateHeads} from './candidateDuplicates'
import {filterCandidates} from './candidateFilters'
import type {NoteCandidate} from './notationRecognition'
it('flags same-head alternatives and filters them without merging selection or distinct adjacent notes',()=>{const note:NoteCandidate={id:0,x:20,y:30,instrument:'Hi-hat',shape:'cross',strength:1,stemHint:false,flagHint:false};const notes=[note,{...note,id:1,x:22,instrument:'Ride' as const},{...note,id:2,x:50},{...note,id:3,y:45}];expect(possibleDuplicateHeads(note,notes,10).map(n=>n.id)).toEqual([1]);expect(filterCandidates(notes,[2],{},'duplicates',undefined,10).map(n=>n.id)).toEqual([0,1]);expect(notes).toHaveLength(4)})
