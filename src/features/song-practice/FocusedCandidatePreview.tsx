import { useEffect, useRef, useState } from 'react'
import type { NoteCandidate } from './notationRecognition'
import type { NoteValueHint } from './noteValueHints'
import { previewBounds, sourcePoint } from './candidatePreviewBounds'
import type { CandidatePreviewSource } from './candidatePreviewBounds'
export interface CandidatePreviewView {context:number;outline:boolean}
export function FocusedCandidatePreview({ note, source, hint, view, onViewChange }: { note: NoteCandidate; source: CandidatePreviewSource; hint?: NoteValueHint;view?:CandidatePreviewView;onViewChange?:(view:CandidatePreviewView)=>void }) {
 const [localOutline,setOutline]=useState(true)
 const [localContext,setContext]=useState(1)
 const outline=view?.outline??localOutline;const context=view?.context??localContext
 const changeView=(next:CandidatePreviewView)=>{setOutline(next.outline);setContext(next.context);onViewChange?.(next)}
 const canvas=useRef<HTMLCanvasElement>(null)
 const bounds=previewBounds(note,source,hint,context)
 useEffect(()=>{
  const target=canvas.current;if(!target)return
  const ctx=target.getContext('2d');if(!ctx)return
  const raster=document.createElement('canvas');raster.width=bounds.width;raster.height=bounds.height
  const original=raster.getContext('2d');if(!original)return
  const image=original.createImageData(bounds.width,bounds.height)
  for(let row=0;row<bounds.height;row++) {
   const start=((bounds.top+row)*source.width+bounds.left)*4
   image.data.set(source.pixels.subarray(start,start+bounds.width*4),row*bounds.width*4)
  }
  original.putImageData(image,0,0)
  const scale=Math.min(4,(context===3?800:480)/bounds.width,400/bounds.height)
  target.width=Math.max(1,Math.round(bounds.width*scale));target.height=Math.max(1,Math.round(bounds.height*scale))
  ctx.imageSmoothingEnabled=false
  ctx.drawImage?.(raster,0,0,bounds.width,bounds.height,0,0,target.width,target.height)
  const project=(x:number,y:number)=>{const p=sourcePoint(x,y,source);return {x:(p.x-bounds.left)/bounds.width*target.width,y:(p.y-bounds.top)/bounds.height*target.height}}
  if(outline) {
   ctx.strokeStyle='#0891b2';ctx.lineWidth=2
   ctx.strokeRect((note.x-6-bounds.left)/bounds.width*target.width,(bounds.y-5-bounds.top)/bounds.height*target.height,12/bounds.width*target.width,10/bounds.height*target.height)
   if(context===3&&hint) {
    ctx.strokeStyle='#d97706';ctx.setLineDash?.([4,3]);ctx.beginPath?.()
    const corners=[[hint.left,hint.top],[hint.left+hint.width,hint.top],[hint.left+hint.width,hint.top+hint.height],[hint.left,hint.top+hint.height]]
    corners.forEach(([x,y],i)=>{const p=project(x,y);if(i===0)ctx.moveTo?.(p.x,p.y);else ctx.lineTo?.(p.x,p.y)})
    ctx.closePath?.();ctx.stroke?.();ctx.setLineDash?.([])
    if(hint.stemX!==undefined&&hint.stemEnd!==undefined&&hint.stemDirection!=='unknown') {
     const start=project(hint.stemX,note.y);const end=project(hint.stemX,hint.stemEnd)
     ctx.beginPath?.();ctx.moveTo?.(start.x,start.y);ctx.lineTo?.(end.x,end.y);ctx.stroke?.()
    }
   }
  }
 },[note,source,hint,outline,context,bounds.left,bounds.top,bounds.width,bounds.height,bounds.y])
 return <section aria-label="Focused symbol inspection" className="rounded border border-cyan-300/40 p-3">
  <h5 className="text-sm font-semibold">Inspect candidate #{note.id+1}: {note.instrument}</h5>
  <div className="mt-2 flex flex-wrap gap-2">
   <button aria-pressed={!outline} onClick={()=>changeView({context,outline:!outline})} className="rounded border border-white/30 px-3 py-2 text-sm">Clean source view</button>
   <button aria-pressed={context===2} onClick={()=>changeView({outline,context:context===2?1:2})} className="rounded border border-white/30 px-3 py-2 text-sm">Wider context</button>
   <button aria-pressed={context===3} onClick={()=>changeView({outline,context:context===3?1:3})} className="rounded border border-white/30 px-3 py-2 text-sm">Beam context</button>
  </div>
  <canvas ref={canvas} aria-label={`Magnified candidate ${note.id+1}`} className="mt-2 block h-auto max-h-80 max-w-full rounded bg-white" />
  <p className="mt-2 text-xs text-zinc-300">Original crop pixels, magnified for manual inspection. {outline?'Cyan marks the candidate head.':'Outline hidden: original source pixels only.'} Compare heads, stems, beams and the source legend. Nearby symbols can belong to separate voices. Suggested duration: {hint?.value??'unknown'}. Magnification does not improve recognition confidence or modify notes.</p>
  {context===3&&<p className="mt-2 text-xs text-amber-100">Beam context includes neighboring stems. {outline?'Amber marks the duration scan window and detected stem, when available.':'All overlays are hidden.'} Evidence: {hint?.beamBands??0} beam band(s), {hint?.flagBands??0} short flag band(s); stem {hint?.stemDirection??'unknown'}. {hint?.clippedStem?'Stem touches the crop edge; expand the original selection.':''} These marks are tentative evidence, not confirmed duration.</p>}
 </section>
}
