import {inspectNoteValue} from './noteValueHints'
import type {NoteValueHint} from './noteValueHints'
import type {NoteCandidate,RecognitionImage,StaffCandidate} from './notationRecognition'
/** Neighbour context requires a real ink path; nearby stems alone never imply a shared beam. */
export function inspectRhythmContext(image:RecognitionImage,staff:StaffCandidate,notes:readonly NoteCandidate[]):Record<number,NoteValueHint>{
 const hints=Object.fromEntries(notes.map(note=>[note.id,inspectNoteValue(image,staff,note)]))
 const at=(x:number,y:number)=>x>=0&&x<image.width&&y>=0&&y<image.height?image.ink[Math.round(y)*image.width+Math.round(x)]??0:0
 for(const note of notes){const hint=hints[note.id];if(hint.stemX===undefined||hint.stemEnd===undefined||hint.stemDirection==='unknown')continue
 const neighbours=notes.filter(other=>{const peer=hints[other.id];if(other.id===note.id||peer.stemX===undefined||peer.stemEnd===undefined||peer.stemDirection!==hint.stemDirection)return false;const dx=peer.stemX-hint.stemX!,dy=peer.stemEnd-hint.stemEnd!;if(Math.abs(dx)<staff.gap*0.8||Math.abs(dx)>staff.gap*7||Math.abs(dy/dx)>0.5)return false;let dark=0,total=0;for(let d=3;d<Math.abs(dx)-2;d++){const x=hint.stemX!+Math.sign(dx)*d,y=hint.stemEnd!+dy*d/Math.abs(dx);if(Array.from({length:5},(_,i)=>staff.top+i*staff.gap).some(line=>Math.abs(line-y)<=1))continue;total++;dark+=Math.max(at(x,y-1),at(x,y),at(x,y+1))}return total>=staff.gap&&dark/total>=0.8})
 hint.contextNeighbours=neighbours.map(n=>n.id)
 if(neighbours.length){hint.contextEvidence='shared-beam';if(hint.evidence==='flag'&&!hint.manualReviewed){hint.beamBands=hint.flagBands??0;hint.flagBands=0;hint.evidence='beam'}hint.contextMessage='An ink path links adjacent stems. Compare each partial beam; neighbours can have mixed durations.'}
 else if(hint.evidence==='flag'){hint.contextEvidence='isolated-flag';hint.contextMessage='Short flag evidence has no confirmed neighbouring beam path. Verify the flag count in the source.'}
 }
 return hints
}
export function unevenOnsetSpacing(notes:readonly NoteCandidate[],first:number,last:number):boolean{
 const xs=[...new Set(notes.filter(n=>n.x>=first&&n.x<=last).map(n=>n.x))].sort((a,b)=>a-b);if(xs.length<4)return false
 const gaps=xs.slice(1).map((x,i)=>x-xs[i]);const sorted=[...gaps].sort((a,b)=>a-b),median=sorted[Math.floor(sorted.length/2)];return gaps.some(gap=>Math.abs(gap-median)>median*0.35)
}
