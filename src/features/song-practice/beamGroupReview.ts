import type {NoteCandidate} from './notationRecognition'
import type {NoteValueHint} from './noteValueHints'
import type {RhythmEvent} from './rhythmTypes'
export interface BeamReviewGroup {ids:number[];sharedPairs:[number,number][];mixed:boolean;unresolved:boolean;values:string[]}
/** Ink-linked groups only; group membership never implies uniform duration. */
export function beamReviewGroups(notes:readonly NoteCandidate[],hints:Record<number,NoteValueHint>):BeamReviewGroup[]{
 const available=new Set(notes.map(n=>n.id)),seen=new Set<number>(),groups:BeamReviewGroup[]=[]
 for(const note of notes){if(seen.has(note.id))continue;const ids:number[]=[],queue=[note.id];while(queue.length){const id=queue.pop()!;if(seen.has(id)||!available.has(id))continue;seen.add(id);ids.push(id);queue.push(...(hints[id]?.contextNeighbours??[]),...(hints[id]?.sharedStemNeighbours??[]))}if(ids.length<2)continue
  ids.sort((a,b)=>notes.find(n=>n.id===a)!.x-notes.find(n=>n.id===b)!.x||a-b)
  const values=[...new Set(ids.map(id=>hints[id]?.value??'unknown'))],sharedPairs:[number,number][]=[]
  for(const id of ids)for(const peer of hints[id]?.sharedStemNeighbours??[])if(ids.includes(peer)&&id<peer)sharedPairs.push([id,peer])
  groups.push({ids,sharedPairs,values,mixed:values.filter(v=>v!=='unknown').length>1,unresolved:ids.some(id=>!hints[id]||hints[id].value==='unknown'||hints[id].possibleDot||hints[id].clippedStem)})
 }
 return groups
}
/** An explicit user duration choice affects source-linked notes only; manual rests remain intact. */
export function setBeamGroupDuration(events:readonly RhythmEvent[],ids:readonly number[],duration:1|2|4):RhythmEvent[]{
 if(![1,2,4].includes(duration))throw Error('Choose a supported group duration.')
 const selected=new Set(ids);return events.map(event=>event.kind==='note'&&event.sourceCandidateId!==undefined&&selected.has(event.sourceCandidateId)?{...event,duration}:{...event})
}
