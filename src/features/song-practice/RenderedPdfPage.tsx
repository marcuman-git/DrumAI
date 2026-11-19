import {useEffect,useRef,useState} from 'react'
import {PdfPageRangeError,renderLocalPdfPage} from './pdfPageRenderer'
export function RenderedPdfPage({file,initialPage,title}:{file:File;initialPage:number;title:string}) {
 const [page,setPage]=useState(initialPage),[zoom,setZoom]=useState(1),[pageCount,setPageCount]=useState<number|null>(null)
 const [status,setStatus]=useState('Rendering local PDF…'),[ready,setReady]=useState(false)
 const canvasRef=useRef<HTMLCanvasElement|null>(null)
 useEffect(()=>{
  const controller=new AbortController(),staging=document.createElement('canvas')
  void renderLocalPdfPage(file,page,staging,controller.signal,zoom).then(result=>{
   if(controller.signal.aborted)return
   const canvas=canvasRef.current,context=canvas?.getContext('2d');if(!canvas||!context)throw new Error('Canvas unavailable')
   canvas.width=staging.width;canvas.height=staging.height;context.drawImage(staging,0,0)
   setPageCount(result.pageCount);setReady(true);setStatus(`Page ${page} of ${result.pageCount}; zoom ${Math.round(zoom*100)}%.`)
  }).catch(error=>{if(controller.signal.aborted)return;setReady(false);if(error instanceof PdfPageRangeError){setPageCount(error.pageCount);setStatus(`Page ${page} is outside this PDF. Choose a page from 1 to ${error.pageCount}.`)}else setStatus('Unable to render this local PDF. Use the browser PDF reader below.')})
  return()=>controller.abort()
 },[file,page,zoom])
 function navigate(value:number){if(value===page||!Number.isInteger(value)||value<1||value>(pageCount??999))return;setReady(false);setStatus('Rendering local PDF…');setPage(value)}
 return <section aria-label={title} className="min-w-0 space-y-2">
 <h4 className="font-semibold">{title}</h4><div className="flex flex-wrap items-center gap-2">
 <button disabled={page<=1} onClick={()=>navigate(page-1)} className="rounded border p-2">Previous page</button>
 <label>Page<input aria-label={`${title} page`} type="number" min={1} max={pageCount??999} value={page} onChange={event=>navigate(Number(event.target.value))} className="ml-1 w-16 rounded bg-zinc-900 p-1"/></label>
 <button disabled={pageCount===null||page>=pageCount} onClick={()=>navigate(page+1)} className="rounded border p-2">Next page</button>
 <label>Zoom<select aria-label={`${title} zoom`} value={zoom} onChange={event=>{if(Number(event.target.value)===zoom)return;setReady(false);setStatus('Rendering local PDF…');setZoom(Number(event.target.value))}} className="ml-1 rounded bg-zinc-900 p-1">{[0.5,0.75,1,1.5,2].map(value=><option key={value} value={value}>{value*100}%</option>)}</select></label>
 </div><p role="status" className="text-xs">{status}</p>
 <div className="h-[65vh] overflow-auto rounded border bg-zinc-100"><canvas ref={canvasRef} aria-label={`${title} canvas`} hidden={!ready} style={{width:`${zoom*100}%`,maxWidth:'none'}}/></div>
 <p className="text-xs text-zinc-400">Viewing pages and zoom does not edit chart references or the analysis crop.</p></section>
}
