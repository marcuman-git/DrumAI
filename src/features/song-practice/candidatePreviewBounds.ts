import type { NoteCandidate, StaffCandidate } from './notationRecognition'
import type { NoteValueHint } from './noteValueHints'
export interface CandidatePreviewSource { pixels: Uint8ClampedArray; width: number; height: number; angle: number; staff?: StaffCandidate }
export function sourcePoint(x:number,y:number,source:Pick<CandidatePreviewSource,'width'|'angle'>) {
 return {x,y:y+Math.tan(source.angle*Math.PI/180)*(x-source.width/2)}
}
export function previewBounds(note: NoteCandidate, source: Pick<CandidatePreviewSource, 'width' | 'height' | 'angle' | 'staff'>, hint?: NoteValueHint, context = 1) {
 const gap=source.staff?.gap??12
 const head=sourcePoint(note.x,note.y,source)
 const horizontal=context===3?Math.max(72,gap*6):24*(context===2?2:1)
 const above=context===3?Math.max(60,gap*5):40*(context===2?2:1)
 const below=context===3?Math.max(48,gap*4):30*(context===2?2:1)
 const points=[{x:note.x-horizontal,y:head.y-above},{x:note.x+horizontal,y:head.y+below}]
 if(hint) {
  const pad=context===3?gap*3:0
  for(const x of [hint.left-pad,hint.left+hint.width+pad])for(const y of [hint.top-pad,hint.top+hint.height+pad])points.push(sourcePoint(x,y,source))
 }
 const left=Math.max(0,Math.min(source.width-1,Math.floor(Math.min(...points.map(p=>p.x)))))
 const top=Math.max(0,Math.min(source.height-1,Math.floor(Math.min(...points.map(p=>p.y)))))
 const right=Math.min(source.width,Math.max(left+1,Math.ceil(Math.max(...points.map(p=>p.x)))))
 const bottom=Math.min(source.height,Math.max(top+1,Math.ceil(Math.max(...points.map(p=>p.y)))))
 return {left,top,width:right-left,height:bottom-top,y:head.y}
}
