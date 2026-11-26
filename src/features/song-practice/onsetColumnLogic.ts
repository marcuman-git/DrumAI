import {alignedTime,tickTime,timeTick} from './rhythmTime'
import type {NoteCandidate} from './notationRecognition'
import type {RhythmEvent} from './rhythmTypes'
import type {NoteValueHint} from './noteValueHints'
export interface OnsetColumn {candidateIds:number[];step:number}
export function createOnsetColumns(notes:readonly NoteCandidate[],gap:number,first:number,last:number,slots:number,lastStep:number,events:readonly RhythmEvent[]=[]):OnsetColumn[]{
 const groups:NoteCandidate[][]=[];for(const note of [...notes].sort((a,b)=>a.x-b.x)){const group=groups.at(-1);if(group&&note.x-group[0].x<=gap*.65)group.push(note);else groups.push([note])}
 return groups.flatMap(group=>{const columns:OnsetColumn[]=[];for(const note of group){const existing=events.find(e=>e.sourceCandidateId===note.id);const step=existing?.step??Math.max(0,Math.min(slots-1,Math.round((note.x-first)/Math.max(1,last-first)*lastStep)));const column=columns.find(c=>c.step===step);if(column)column.candidateIds.push(note.id);else columns.push({candidateIds:[note.id],step})}return columns})
}
/** Applies explicit timing only; preserves reviewed durations, rests, ties and physical head coordinates. */
export function applyOnsetColumns(columns:readonly OnsetColumn[],notes:readonly NoteCandidate[],events:readonly RhythmEvent[],slots:number,defaultDuration:1|2|4,hints:Record<number,NoteValueHint>,useHints=false):RhythmEvent[]{
 const ids=columns.flatMap(c=>c.candidateIds),expected=new Set(notes.map(n=>n.id))
 if(![8,16].includes(slots)||ids.length!==notes.length||new Set(ids).size!==ids.length||ids.some(id=>!expected.has(id))||columns.some(c=>!c.candidateIds.length||!alignedTime(c.step)||c.step<0||c.step>=slots))throw Error('Every checked head needs exactly one valid onset assignment.')
 const assigned=new Map(columns.flatMap(c=>c.candidateIds.map(id=>[id,c.step] as const)))
 const keys=notes.map(n=>`${n.instrument}:${assigned.get(n.id)}`)
 if(new Set(keys).size!==keys.length)throw Error('Two checked heads would merge into one instrument/onset. Separate their slots or uncheck a duplicate detection.')
 const firstEvent=new Map<number,RhythmEvent>();for(const e of events)if(e.sourceCandidateId!==undefined&&!firstEvent.has(e.sourceCandidateId))firstEvent.set(e.sourceCandidateId,e)
 const next=events.map(e=>{const step=e.sourceCandidateId===undefined?undefined:assigned.get(e.sourceCandidateId);return step===undefined?{...e}:{...e,step:tickTime(timeTick(e.step+step-firstEvent.get(e.sourceCandidateId!)!.step))}})
 for(const note of notes)if(!firstEvent.has(note.id)){const hint=hints[note.id],value=hint?.manualReviewed||useHints?hint?.value:'unknown';next.push({sourceCandidateId:note.id,instrument:note.instrument,step:assigned.get(note.id)!,duration:value==='quarter'?4:value==='eighth'?2:value==='sixteenth'?1:defaultDuration,kind:'note',dynamic:2})}
 if(next.some(e=>e.step<0||e.step>=slots))throw Error('Moving this column would put a reviewed continuation outside the bar. Adjust its events manually.')
 return next
}
