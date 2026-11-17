import {expect,it} from 'vitest'
import {identityDraftIssues,identityStatus,setIdentityReview} from './cymbalIdentityReview'
import {candidatesToBar} from './notationRecognition'
import type {NoteCandidate} from './notationRecognition'
const note:NoteCandidate={id:3,x:20,y:30,instrument:'Crash',shape:'cross',symbolHint:'circled-cross',strength:1,stemHint:false,flagHint:false}
it('records source verification for the current voice and treats a changed voice as unreviewed',()=>{
 const [verified]=setIdentityReview([note],3,'verified')
 expect(identityStatus(verified)).toBe('verified');expect(identityDraftIssues([verified])).toEqual([])
 expect(identityStatus({...verified,instrument:'Ride'})).toBe('unreviewed')
 expect(identityDraftIssues([{...verified,instrument:'Ride'}])).toHaveLength(1)
 expect(note.identityReview).toBeUndefined()
})
it('tracks unsupported symbols and clears review without restoring acceptance',()=>{
 const [unsupported]=setIdentityReview([note],3,'unsupported')
 expect(identityStatus(unsupported)).toBe('unsupported');expect(identityDraftIssues([unsupported])).toHaveLength(1)
 expect(identityStatus(setIdentityReview([unsupported],3,'unreviewed')[0])).toBe('unreviewed')
})
it('requires review for flagged checked cymbals while ordinary heads can use the existing source confirmation',()=>{
 expect(identityDraftIssues([note])).toHaveLength(1)
 expect(identityDraftIssues([{...note,symbolHint:undefined}])).toEqual([])
 expect(identityDraftIssues([{...note,symbolHint:undefined,positionHint:'ambiguous'}])).toHaveLength(1)
})
it('keeps temporary identity records out of chart data',()=>{
 const [verified]=setIdentityReview([note],3,'verified')
 const bar=candidatesToBar([verified],20,190,16,14)
 expect(bar.Crash?.[0]).toBe(2);expect(JSON.stringify(bar)).not.toContain('identityReview')
})
