import type {NoteCandidate} from './notationRecognition'
import type {NoteValueHint} from './noteValueHints'
import {candidateReviewReasons} from './candidateReview'
export function CandidateEvidenceSummary({notes,accepted,hints,onFocus}:{notes:readonly NoteCandidate[];accepted:readonly number[];hints:Record<number,NoteValueHint>;onFocus:(id:number)=>void}){
 const checked=new Set(accepted),issues=notes.map(note=>({note,reasons:candidateReviewReasons(note,notes,hints)})).filter(item=>item.reasons.length)
 return <details aria-label="Recognition evidence summary" className="rounded border p-2"><summary>Evidence review: {issues.filter(item=>checked.has(item.note.id)).length} checked candidates have review guidance</summary>
 <p>Review guidance is separate from recognition confidence. Filters do not exclude hidden candidates, and manual duration review does not verify cymbal identity.</p>
 {issues.length?issues.map(({note,reasons})=><div key={note.id} className="my-2 rounded border p-2"><button onClick={()=>onFocus(note.id)} className="rounded border p-1">Inspect evidence #{note.id+1}</button> {note.instrument}: {checked.has(note.id)?'checked':'unchecked'}<ul className="ml-4 list-disc">{reasons.map(reason=><li key={reason}>{reason}</li>)}</ul></div>):<p>No flagged evidence in this scan. Verify the notes against the source before building a draft.</p>}
 </details>
}
