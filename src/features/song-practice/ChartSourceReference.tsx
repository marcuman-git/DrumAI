import { useState, type SetStateAction } from 'react'
import type { SongChart } from './songChartLogic'
import { newChartReview, referencePages } from './chartReviewLogic'
import type { SourceReferenceRequest } from './sourceReferenceNavigation'
export function ChartSourceReference({chart,index,playing,setChart,onNavigate}:{chart:SongChart;index:number;playing:boolean;setChart:(update:SetStateAction<SongChart>)=>void;onNavigate?:(reference:SourceReferenceRequest)=>void}) {
 const reference=chart.review
 return <details className="space-y-2 rounded border border-cyan-300/40 p-3"><summary className="cursor-pointer font-semibold">Source reference — Bar {index+1}</summary>
 <p className="text-xs">Save a local PDF filename and page with this chart. Choose that file in PDF Chart Reference to navigate. Apply or discard duration drafts before changing references.</p>
 <fieldset disabled={playing} className="space-y-2">
 <label className="block">Source PDF name<input aria-label="Chart source PDF name" maxLength={120} value={reference?.source??''} onChange={event=>{const source=event.target.value;setChart(value=>{const review=value.review??newChartReview(value);return {...value,review:{...review,source,bars:review.bars.map(bar=>({...bar,status:'Pending',signature:''}))}}})}} className="ml-2 rounded bg-zinc-900 p-2"/></label>
 <label className="block">Reference page<input aria-label="Chart source page" type="number" min={1} max={999} value={reference?.bars[index]?.page??1} onChange={event=>{const page=Number(event.target.value);if(!Number.isInteger(page)||page<1||page>999)return;setChart(value=>{const review=value.review??newChartReview(value);return {...value,review:{...review,bars:review.bars.map((bar,i)=>i===index?{...bar,page,additionalPages:bar.additionalPages?.filter(value=>value!==page),status:'Pending',signature:''}:bar)}}})}} className="ml-2 w-20 rounded bg-zinc-900 p-2"/></label>
 <button disabled={!reference?.source.trim()||!onNavigate} onClick={()=>onNavigate?.({source:reference!.source,page:reference?.bars[index]?.page??1})} className="rounded border p-2">Show source reference — page {reference?.bars[index]?.page??1}</button>
 {!!reference?.bars[index]?.additionalPages?.length&&<button onClick={()=>setChart(value=>({...value,review:value.review?{...value.review,bars:value.review.bars.map((bar,i)=>i===index?{...bar,additionalPages:undefined,status:'Pending',signature:''}:bar)}:undefined}))} className="rounded border p-2">Clear additional source pages</button>}
 {reference&&<SourcePageComparison key={JSON.stringify([index,reference.source,reference.bars[index]])} source={reference.source} page={reference.bars[index]?.page??1} pages={referencePages(reference.bars[index])} onNavigate={onNavigate}/>}
 </fieldset></details>
}

function SourcePageComparison({source,page,pages,onNavigate}:{source:string;page:number;pages:number[];onNavigate?:(reference:SourceReferenceRequest)=>void}){
 const [comparePage,setComparePage]=useState(pages.find(value=>value!==page)??(page<999?page+1:998))
 return <section aria-label="Source page comparison" className="space-y-2">
 {pages.length>1&&<p className="text-xs">This bar retains source pages {pages.join(', ')}. Splitting retains all these pages until you recheck their mapping.</p>}
 <div className="flex flex-wrap gap-2">{pages.map(value=><button key={value} disabled={!source.trim()||!onNavigate} onClick={()=>onNavigate?.({source,page:value})} className="rounded border p-2">View retained page {value}</button>)}</div>
 <label className="block">Compare against page<input aria-label="Comparison PDF page" type="number" min={1} max={999} value={comparePage} onChange={event=>{const value=Number(event.target.value);if(Number.isInteger(value)&&value>=1&&value<=999)setComparePage(value)}} className="ml-2 w-20 rounded bg-zinc-900 p-2"/></label>
 <button disabled={!source.trim()||!onNavigate} onClick={()=>onNavigate?.({source,page,comparePage})} className="m-1 rounded border p-2">Compare source pages</button>
 <button disabled={!source.trim()||!onNavigate} onClick={()=>onNavigate?.({source,page})} className="m-1 rounded border p-2">Return to single source page</button>
 <p className="text-xs">Comparison changes the local PDF view only. It does not change saved page references or duration drafts.</p>
 </section>
}
