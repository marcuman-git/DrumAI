import {sameTime,durationNotation} from './rhythmTime'
import type {RhythmEvent} from './rhythmTypes'
import type {NoteCandidate} from './notationRecognition'
import type {NoteValueHint} from './noteValueHints'
import type {ChartBar} from './chartKit'
export interface RhythmAuditItem {index:number;reasons:string[]}
/** Interpretation guidance only; valid coverage and source verification remain separate gates. */
export function rhythmEvidenceAudit(events:readonly RhythmEvent[],notes:readonly NoteCandidate[]=[],hints:Record<number,NoteValueHint>={},previous?:ChartBar,slots=16):RhythmAuditItem[]{
 return events.map((event,index)=>{const reasons:string[]=[],note=notes.find(n=>n.id===event.sourceCandidateId),hint=note?hints[note.id]:undefined
  const spec=durationNotation(event.duration);if(spec.triplet)reasons.push('Triplet: verify all three onsets and the source tuplet marking. Automatic hints do not establish triplet timing.');if(event.grace)reasons.push('Grace strokes use a 35 ms spacing in playback; verify flam or drag identity against the source.');if(event.articulation)reasons.push('Articulation is manually reviewed; synthesized playback is an approximation.');if(spec.dot)reasons.push('Dotted duration: verify the dot and the onset of the following event against the source.')
  if(hint?.possibleDot&&event.duration!==3&&event.duration!==6)reasons.push('Source candidate has possible dot evidence, but this event uses a straight duration.')
  const hintedDuration=hint?.value==='quarter'?4:hint?.value==='eighth'?2:hint?.value==='sixteenth'?1:undefined
  if(event.kind==='note'&&hintedDuration!==undefined&&hintedDuration!==event.duration)reasons.push(`Event duration ${event.duration} slots differs from candidate hint ${hintedDuration}; keep your reviewed choice until the source is checked.`)
  if(event.kind==='rest'&&note)reasons.push('This rest still references a detected notehead. Verify that the source shows silence rather than a rejected or tied stroke.')
  if(event.tieFromPrevious){const prior=event.step===0?previous?.rhythmEvents:events;const boundary=event.step===0?(previous?.beats===2?8:16):event.step;const preceding=prior?.find(e=>e!==event&&e.instrument===event.instrument&&e.kind==='note'&&sameTime(e.step+e.duration,boundary))
   reasons.push(preceding?'Tie continuation: verify the same voice continues across this boundary; it suppresses a fresh strike.':'Tie has no adjacent preceding note in this voice; resolve the source boundary before applying.')
  }
  if(event.step+event.duration>slots)reasons.push('Duration crosses the bar end. Use source-reviewed fragments and a tie where appropriate.')
  return {index,reasons}
 }).filter(item=>item.reasons.length)
}
