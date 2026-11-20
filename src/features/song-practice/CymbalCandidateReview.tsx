import {CymbalKeyReference} from './CymbalKeyReference'
import {cymbalSourceGuidance} from './cymbalSourceGuidance'
import { identityStatus } from './cymbalIdentityReview'
import type { CymbalIdentityStatus } from './cymbalIdentityReview'
import type { NoteCandidate } from './notationRecognition'
export function CymbalCandidateReview({note,onMap,onFocus,onReviewIdentity,sourceLegendReference}:{sourceLegendReference?:string;note:NoteCandidate;onMap:(id:number,instrument:NoteCandidate['instrument'])=>void;onFocus:(id:number)=>void;onReviewIdentity?:(id:number,status:CymbalIdentityStatus|'unreviewed')=>void}) {
 if(note.shape!=='cross'&&!['China','Splash','Ride bell'].includes(note.instrument))return null
 return <section aria-label={`Cymbal review candidate ${note.id+1}`} className="my-2 space-y-2 rounded border border-amber-300/40 p-2">
  <p>Identity review: {identityStatus(note)}{identityStatus(note)==='verified'?` as ${note.instrument}`:''}.</p>
  <strong>Verify cymbal against source legend</strong>
  <CymbalKeyReference/>
  {sourceLegendReference&&<p>Current source reference: {sourceLegendReference}</p>}
  {note.identityReview?.legendReference&&<p>Verification reference: {note.identityReview.legendReference}</p>}
  {note.symbolHint==='circled-cross'&&<p>Ring surrounds the head. This can mean China or another source-specific cymbal; it does not confirm Crash, Ride or open Hi-hat. China, Splash and Ride bell have separate editable voices. Map manually using the source legend. Leave unchecked if none matches.</p>}
  {note.positionHint==='ambiguous'&&<p>The cross center lies near the top line. Compare Hi-hat and Ride positions in this source; choose a voice only after checking the legend.</p>}
  <details aria-label={`Source legend guidance ${note.id+1}`}><summary>Compare symbol, position and articulation with the source key</summary>{cymbalSourceGuidance(note).map(text=><p key={text}>{text}</p>)}</details>
  <button onClick={()=>onFocus(note.id)} className="rounded border border-white/25 p-1">Inspect cymbal {note.id+1}</button>
  <div className="flex flex-wrap gap-2">{(['Hi-hat','Ride','Crash','Open hi-hat','Pedal hi-hat','China','Splash','Ride bell'] as const).map(instrument=><button key={instrument} aria-label={`Use ${instrument} for candidate ${note.id+1}`} onClick={()=>onMap(note.id,instrument)} className="rounded border border-white/25 p-1">Use {instrument}</button>)}</div>
  {onReviewIdentity&&<div className="flex flex-wrap gap-2"><button aria-label={`Verify identity for candidate ${note.id+1}`} onClick={()=>onReviewIdentity(note.id,'verified')} className="rounded border border-emerald-300/40 p-1">I verified {note.instrument} against the source legend</button><button aria-label={`Unsupported identity for candidate ${note.id+1}`} onClick={()=>onReviewIdentity(note.id,'unsupported')} className="rounded border border-amber-300/40 p-1">Unsupported / exclude</button><button aria-label={`Clear identity review for candidate ${note.id+1}`} onClick={()=>onReviewIdentity(note.id,'unreviewed')} className="rounded border border-white/25 p-1">Clear identity review</button></div>}
  <p>Mapping changes the suggested voice only. It does not check this candidate or confirm its duration.</p>
 </section>
}
