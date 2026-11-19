import {useEffect,useRef,useState} from 'react'
import {renderLocalPdfPage} from './pdfPageRenderer'
import {validSourceCrop,validSourceAnchor} from './sourceTrace'
import type {SourceCrop,SourceAnchor} from './sourceTrace'
export function SourceCropInspection({file,crop,point}:{file:File;crop:SourceCrop;point?:SourceAnchor}){
 const [ready,setReady]=useState(false)
 const canvas=useRef<HTMLCanvasElement|null>(null),[status,setStatus]=useState('Rendering original source crop…')
 useEffect(()=>{setReady(false);setStatus('Rendering original source crop…');const request=new AbortController(),page=document.createElement('canvas');if(!validSourceCrop(crop)){setStatus('Saved source crop is invalid.');return}
 void renderLocalPdfPage(file,crop.page,page,request.signal).then(()=>{if(request.signal.aborted)return;const target=canvas.current,context=target?.getContext('2d');if(!target||!context)throw new Error('Canvas unavailable');const r=crop.region;target.width=Math.max(20,Math.round(r.width*page.width));target.height=Math.max(20,Math.round(r.height*page.height));context.drawImage(page,r.x*page.width,r.y*page.height,r.width*page.width,r.height*page.height,0,0,target.width,target.height);if(point&&validSourceAnchor(point)&&point.page===crop.page){const x=(point.x-r.x)/r.width*target.width,y=(point.y-r.y)/r.height*target.height;context.strokeStyle='#d97706';context.lineWidth=2;context.strokeRect(x-8,y-8,16,16)}setReady(true);setStatus(`Original source crop, page ${crop.page}${point?'; highlighted original event location':''}.`)}).catch(()=>{if(!request.signal.aborted)setStatus('Could not render source crop. Check the original PDF and page.')});return()=>request.abort()
 },[file,crop,point])
 return <section aria-label="Saved source crop inspection" className="rounded border p-3"><p role="status">{status}</p><div className="max-h-96 overflow-auto bg-white"><canvas ref={canvas} aria-label="Saved original source crop" hidden={!ready} className="w-full"/></div><p className="text-xs">Saved locations are provenance, not proof of the current duration or instrument. Recheck edits against the source.</p></section>
}
