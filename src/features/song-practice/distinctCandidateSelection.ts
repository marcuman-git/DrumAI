import type {NoteCandidate} from './notationRecognition'
import {identityStatus} from './cymbalIdentityReview'
/** Opt-in conservative duplicate selection. Separate stacked voices remain distinct. */
export function distinctCandidateSelection(notes:readonly NoteCandidate[],gap:number){
 const selected:NoteCandidate[]=[],excluded:{id:number;kept:number}[]=[]
 for(const note of [...notes].filter(n=>identityStatus(n)!=='unsupported').sort((a,b)=>b.strength-a.strength||a.id-b.id)){
  const overlap=selected.find(other=>other.shape===note.shape&&Math.abs(other.x-note.x)<=Math.max(1,gap*.3)&&Math.abs(other.y-note.y)<=Math.max(1,gap*.25))
  if(overlap)excluded.push({id:note.id,kept:overlap.id});else selected.push(note)
 }
 return {ids:selected.map(n=>n.id),excluded}
}
/** Two identities at the same physical center cannot silently become two attacks. */
export function competingHeadIssues(notes:readonly NoteCandidate[]){return notes.flatMap((note,index)=>notes.slice(0,index).filter(other=>other.shape===note.shape&&other.instrument!==note.instrument&&Math.abs(other.x-note.x)<=1&&Math.abs(other.y-note.y)<=1).map(other=>`Candidates #${other.id+1} and #${note.id+1} share one head center with competing identities. Compare the source and uncheck the duplicate before building a draft.`))}
