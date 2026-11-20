import type {NoteCandidate} from './notationRecognition'
export type CymbalIdentityStatus='verified'|'unsupported'
export interface CymbalIdentityReview {status:CymbalIdentityStatus; instrument:NoteCandidate['instrument'];legendReference?:string}
export function identityStatus(note:NoteCandidate):'unreviewed'|CymbalIdentityStatus {
 return note.identityReview?.instrument===note.instrument?note.identityReview.status:'unreviewed'
}
export function identityDraftIssues(notes:readonly NoteCandidate[]):string[] {
 return notes.filter(note=>(note.shape==='cross'||['China','Splash','Ride bell'].includes(note.instrument))&&(identityStatus(note)==='unsupported'||(note.symbolHint==='circled-cross'||note.positionHint==='ambiguous'||['China','Splash','Ride bell'].includes(note.instrument))&&identityStatus(note)!=='verified')).map(note=>`Candidate #${note.id+1}: ${identityStatus(note)==='unsupported'?'unsupported identity must stay excluded':'verify cymbal identity against the source legend'}.`)
}
export function setIdentityReview(notes:readonly NoteCandidate[],id:number,status:CymbalIdentityStatus|'unreviewed',legendReference=''):NoteCandidate[] {
 return notes.map(note=>note.id!==id||(note.shape!=='cross'&&!['China','Splash','Ride bell'].includes(note.instrument))?note:{...note,identityReview:status==='unreviewed'?undefined:{status,instrument:note.instrument,...(status==='verified'?{legendReference:legendReference.slice(0,4000)}:{})}})
}
