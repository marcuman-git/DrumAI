import type { NoteCandidate } from './notationRecognition'
import type { NoteValueHint } from './noteValueHints'
import type { RhythmEvent } from './rhythmTypes'
import { CHART_INSTRUMENTS } from './chartKit'
import { validRhythmEvents } from './reviewedRhythm'
export function downloadText(text:string,name:string,type='application/json') { const url=URL.createObjectURL(new Blob([text],{type})); const a=document.createElement('a'); a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),0) }
/** Includes all crop bytes so different sources cannot silently reuse confirmations. */
export function sourceFingerprint(pixels:Uint8ClampedArray,width:number,height:number,source:string,page:number):string {
 let hash=2166136261; for(const byte of pixels) hash=Math.imul(hash^byte,16777619)>>>0
 return JSON.stringify([source,page,width,height,hash])
}
export interface SourceReviewSession {version:1; sourceKey:string; scanKey:string; legend:string; notes:NoteCandidate[]; accepted:number[]; hints:Record<number,NoteValueHint>; events:RhythmEvent[]}
export function restoreSourceReview(text:string,sourceKey:string,scanKey:string,current:NoteCandidate[],slots:number):SourceReviewSession {
 if(text.length>1000000)throw new Error('Review session is too large.')
 const value=JSON.parse(text) as SourceReviewSession
 if(value.version!==1||value.sourceKey!==sourceKey||value.scanKey!==scanKey)throw new Error('Session source, crop or scan settings differ. Use the matching source and settings first.')
 if(typeof value.legend!=='string'||value.legend.length>4000||!Array.isArray(value.notes)||value.notes.length!==current.length||!Array.isArray(value.accepted)||!value.hints||typeof value.hints!=='object'||!validRhythmEvents(value.events,slots+6)||value.events.some(event=>event.step>=slots))throw new Error('Invalid review session.')
 for(let index=0;index<current.length;index++){
  const note=value.notes[index],original=current[index]
  if(!note||note.id!==original.id||note.x!==original.x||note.y!==original.y||note.shape!==original.shape||!CHART_INSTRUMENTS.includes(note.instrument))throw new Error('Session candidates do not match this scan.')
  // Restore mapping only; clear identity records and derived evidence until rechecked.
  value.notes[index]={...original,instrument:note.instrument,identityReview:undefined}
 }
 if(value.accepted.some(id=>!Number.isInteger(id)||!current.some(note=>note.id===id)))throw new Error('Invalid candidate selection.')
 for(const [id,hint] of Object.entries(value.hints))if(!current.some(note=>String(note.id)===id)||!hint||!['quarter','eighth','sixteenth','unknown'].includes(hint.value))throw new Error('Invalid duration review.')
 value.hints=Object.fromEntries(current.map(note=>[note.id,value.hints[note.id]]).filter((entry):entry is [number,NoteValueHint]=>!!entry[1]).map(([id,hint])=>[id,{value:hint.value,manualReviewed:hint.manualReviewed===true,stemDirection:'unknown',beamBands:0,left:0,top:0,width:1,height:1}]))
 return value
}
