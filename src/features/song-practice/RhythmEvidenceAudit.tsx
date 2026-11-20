import {rhythmEvidenceAudit} from './rhythmEvidenceAudit'
import type {RhythmEvent} from './rhythmTypes'
import type {NoteCandidate} from './notationRecognition'
import type {NoteValueHint} from './noteValueHints'
import type {ChartBar} from './chartKit'
export function RhythmEvidenceAudit({events,notes,hints,previous,slots=16,onInspect}:{events:readonly RhythmEvent[];notes?:readonly NoteCandidate[];hints?:Record<number,NoteValueHint>;previous?:ChartBar;slots?:number;onInspect?:(index:number)=>void}){
 const items=rhythmEvidenceAudit(events,notes,hints,previous,slots)
 return <details aria-label="Rhythm source evidence audit" className="rounded border p-2"><summary>Compare rhythm evidence: {items.length} event(s) have guidance</summary><p>Evidence differences do not rewrite your reviewed events. Source-check dots, rests, onsets and ties independently of coverage.</p>{items.length?items.map(item=><div key={item.index} className="my-2 rounded border p-2"><strong>Event {item.index+1}</strong>{item.reasons.map(reason=><p key={reason}>{reason}</p>)}{onInspect&&<button onClick={()=>onInspect(item.index)} className="rounded border p-1">Inspect rhythm event {item.index+1}</button>}</div>):<p>No conflicting source hints in this review. This does not establish that its interpretation is correct.</p>}</details>
}
