import type { SetStateAction } from 'react'
import type { SongChart } from './songChartLogic'
import { newChartReview } from './chartReviewLogic'
import type { SourceReferenceRequest } from './sourceReferenceNavigation'
export function ChartSourceReference({chart,index,playing,setChart,onNavigate}:{chart:SongChart;index:number;playing:boolean;setChart:(update:SetStateAction<SongChart>)=>void;onNavigate?:(reference:SourceReferenceRequest)=>void}) {
 const reference=chart.review
 return <details className="space-y-2 rounded border border-cyan-300/40 p-3"><summary className="cursor-pointer font-semibold">Source reference — Bar {index+1}</summary>
 <p className="text-xs">Save a local PDF filename and page with this chart. Choose that file in PDF Chart Reference to navigate. Apply or discard duration drafts before changing references.</p>
 <fieldset disabled={playing} className="space-y-2">
 <label className="block">Source PDF name<input aria-label="Chart source PDF name" maxLength={120} value={reference?.source??''} onChange={event=>{const source=event.target.value;setChart(value=>{const review=value.review??newChartReview(value);return {...value,review:{...review,source,bars:review.bars.map(bar=>({...bar,status:'Pending',signature:''}))}}})}} className="ml-2 rounded bg-zinc-900 p-2"/></label>
 <label className="block">Reference page<input aria-label="Chart source page" type="number" min={1} max={999} value={reference?.bars[index]?.page??1} onChange={event=>{const page=Number(event.target.value);if(!Number.isInteger(page)||page<1||page>999)return;setChart(value=>{const review=value.review??newChartReview(value);return {...value,review:{...review,bars:review.bars.map((bar,i)=>i===index?{...bar,page,status:'Pending',signature:''}:bar)}}})}} className="ml-2 w-20 rounded bg-zinc-900 p-2"/></label>
 <button disabled={!reference?.source.trim()||!onNavigate} onClick={()=>onNavigate?.({source:reference!.source,page:reference?.bars[index]?.page??1})} className="rounded border p-2">Show source reference — page {reference?.bars[index]?.page??1}</button>
 </fieldset></details>
}
