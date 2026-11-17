import type { NoteCandidate } from './notationRecognition'
export function CymbalCandidateReview({note,onMap,onFocus}:{note:NoteCandidate;onMap:(id:number,instrument:NoteCandidate['instrument'])=>void;onFocus:(id:number)=>void}) {
 if(note.shape!=='cross'||!note.symbolHint&&note.positionHint!=='ambiguous'&&note.cymbalHint!=='ledger-cross')return null
 return <section aria-label={`Cymbal review candidate ${note.id+1}`} className="my-2 space-y-2 rounded border border-amber-300/40 p-2">
  <strong>Verify cymbal against source legend</strong>
  {note.symbolHint==='circled-cross'&&<p>Ring surrounds the head. This can mean China or another source-specific cymbal; it does not confirm Crash, Ride or open Hi-hat. Unsupported voices have no faithful playback mapping. Leave unchecked if no supported voice matches.</p>}
  {note.positionHint==='ambiguous'&&<p>The cross center lies near the top line. Compare Hi-hat and Ride positions in this source; choose a voice only after checking the legend.</p>}
  <button onClick={()=>onFocus(note.id)} className="rounded border border-white/25 p-1">Inspect cymbal {note.id+1}</button>
  <div className="flex flex-wrap gap-2">{(['Hi-hat','Ride','Crash','Open hi-hat','Pedal hi-hat'] as const).map(instrument=><button key={instrument} aria-label={`Use ${instrument} for candidate ${note.id+1}`} onClick={()=>onMap(note.id,instrument)} className="rounded border border-white/25 p-1">Use {instrument}</button>)}</div>
  <p>Mapping changes the suggested voice only. It does not check this candidate or confirm its duration.</p>
 </section>
}
