import {beamContextEvidence} from './beamContextEvidence'
import {inspectNoteValue} from './noteValueHints'
import type {NoteValueHint} from './noteValueHints'
import type {NoteCandidate,RecognitionImage,StaffCandidate} from './notationRecognition'
/** Neighbour context requires a real ink path; nearby stems alone never imply a shared beam. */
export function inspectRhythmContext(image:RecognitionImage,staff:StaffCandidate,notes:readonly NoteCandidate[]):Record<number,NoteValueHint>{
 const hints=Object.fromEntries(notes.map(note=>[note.id,inspectNoteValue(image,staff,note)]))
 const at=(x:number,y:number)=>x>=0&&x<image.width&&y>=0&&y<image.height?image.ink[Math.round(y)*image.width+Math.round(x)]??0:0
 const faintAt=(x:number,y:number)=>x>=0&&x<image.width&&y>=0&&y<image.height?image.stemInk?.[Math.round(y)*image.width+Math.round(x)]??0:0
 const stemAt=(x:number,y:number)=>at(x,y)||(staff.gap<10&&faintAt(x,y)&&!(faintAt(x-2,y)&&faintAt(x+2,y))?1:0)
 for(const note of notes){const hint=hints[note.id];if(hint.stemX===undefined||hint.stemEnd===undefined||hint.stemDirection==='unknown')continue
 const interrupted:number[]=[]
 const neighbours=notes.filter(other=>{const peer=hints[other.id];if(other.id===note.id||peer.stemX===undefined||peer.stemEnd===undefined||peer.stemDirection!==hint.stemDirection)return false
 const evidence=beamContextEvidence(image,staff,{x:hint.stemX!,y:hint.stemEnd!},{x:peer.stemX,y:peer.stemEnd})
 if(evidence==='interrupted')interrupted.push(other.id)
 return evidence==='connected'
 })
 hint.interruptedBeamNeighbours=interrupted

 const sharedStem=notes.filter(other=>{
  const peer=hints[other.id];if(other.id===note.id||peer.stemX===undefined||peer.stemEnd===undefined||peer.stemDirection!==hint.stemDirection)return false
  if(Math.abs(peer.stemX-hint.stemX!)>Math.max(1,staff.gap*0.25)||Math.abs(peer.stemEnd-hint.stemEnd!)>staff.gap*0.4||Math.abs(other.y-note.y)<staff.gap*0.8||Math.abs(other.y-note.y)>staff.gap*5)return false
  const top=Math.min(note.y,other.y),bottom=Math.max(note.y,other.y);let dark=0,total=0
  for(let y=Math.ceil(top+staff.gap*0.5);y<bottom-staff.gap*0.5;y++){
   if(Array.from({length:5},(_,i)=>staff.top+i*staff.gap).some(line=>Math.abs(line-y)<=1))continue
   total++;dark+=Math.max(stemAt(hint.stemX!-1,y),stemAt(hint.stemX!,y),stemAt(hint.stemX!+1,y))
  }
  return total>=Math.max(2,staff.gap*0.3)&&dark/total>=0.85
 })
 hint.sharedStemNeighbours=sharedStem.map(n=>n.id)
 hint.contextNeighbours=neighbours.map(n=>n.id)
 if(neighbours.length){hint.contextEvidence='shared-beam';if(hint.evidence==='flag'&&!hint.manualReviewed){hint.beamBands=hint.flagBands??0;hint.flagBands=0;hint.evidence='beam'}hint.contextMessage='An ink path links adjacent stems. Compare each partial beam; neighbours can have mixed durations.'}
 else if(sharedStem.length){hint.contextEvidence='shared-stem';hint.contextMessage='A continuous vertical stem links these heads. Check each voice and beam count; shared stems do not establish instrument identity or copy a duration.'}
 else if(interrupted.length){hint.contextEvidence='interrupted-beam';hint.contextMessage='A possible beam path contains missing ink. Compare the source: this can be a broken beam or a gap between separate groups. No shared duration is inferred.'}
 else if(hint.evidence==='flag'){hint.contextEvidence='isolated-flag';hint.contextMessage='Short flag evidence has no confirmed neighbouring beam path. Verify the flag count in the source.'}
 }
 return hints
}
export function unevenOnsetSpacing(notes:readonly NoteCandidate[],first:number,last:number):boolean{
 const xs=[...new Set(notes.filter(n=>n.x>=first&&n.x<=last).map(n=>n.x))].sort((a,b)=>a-b);if(xs.length<4)return false
 const gaps=xs.slice(1).map((x,i)=>x-xs[i]);const sorted=[...gaps].sort((a,b)=>a-b),median=sorted[Math.floor(sorted.length/2)];return gaps.some(gap=>Math.abs(gap-median)>median*0.35)
}
