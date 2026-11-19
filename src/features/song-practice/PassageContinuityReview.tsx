import {useState} from 'react'
import {CHART_INSTRUMENTS,notesFor} from './chartKit'
import type {SourceCrop} from './sourceTrace'
import type {SourceReferenceRequest} from './sourceReferenceNavigation'
import type {ChartBar} from './chartKit'
import {ChartStaffNotation} from './ChartStaffNotation'
import {ReviewedBarEditor} from './ReviewedBarEditor'
import {newSongChart} from './songChartLogic'
import {boundaryTieVoices,setBoundaryTie,detachOrphanBoundaryTies} from './chartTieReview'
import {barSlots} from './chartMeter'
export function PassageContinuityReview({bars,onChange,source,references,pages,onInspectSource}:{bars:ChartBar[];onChange:(bars:ChartBar[])=>void;source?:string;references?:SourceCrop[][];pages?:number[];onInspectSource?:(request:SourceReferenceRequest)=>void}){
 const [boundary,setBoundary]=useState(1),[verified,setVerified]=useState(false),[message,setMessage]=useState('')
 if(bars.length<2)return null
 const index=Math.min(boundary,bars.length-1),chart={...newSongChart(),bars,meter:bars[0].beats===2?'2/4' as const:'4/4' as const}
 const orphanCount=bars.reduce((count,bar,i)=>count+(bar.rhythmEvents?.filter(e=>e.step===0&&e.tieFromPrevious&&!bars[i-1]?.rhythmEvents?.some(p=>p.instrument===e.instrument&&p.kind==='note'&&p.step+p.duration===barSlots(bars[i-1]))).length??0),0)
 const firstOnset=Math.min(...(bars[0].rhythmEvents?.filter(e=>e.kind==='note').map(e=>e.step)??Array.from({length:barSlots(bars[0])},(_,i)=>i).filter(step=>CHART_INSTRUMENTS.some(name=>notesFor(bars[0],name)[step]>0))))
 return <details aria-label="Adjacent-bar continuity review" className="rounded border p-3"><summary>Compare adjacent bars, pickups and ties</summary>
 <label>Boundary<select aria-label="Continuity boundary" value={index} onChange={event=>{setBoundary(Number(event.target.value));setVerified(false)}} className="m-2 rounded bg-zinc-900 p-1">{bars.slice(1).map((_,i)=><option key={i} value={i+1}>Bars {i+1} → {i+2}</option>)}</select></label>
 {firstOnset>0&&Number.isFinite(firstOnset)&&<p className="text-amber-100">First bar starts with {firstOnset} silent timing slots. Compare pickup notation with the source: these are explicit rests in the selected 2/4 or 4/4 bar, not automatically shortened pickup timing.</p>}
 {source&&onInspectSource&&<div className="flex gap-2">{[index-1,index].map(i=>(references?.[i]?.[0]||pages?.[i])&&<button key={i} onClick={()=>onInspectSource({source,page:references?.[i]?.[0]?.page??pages![i],crop:references?.[i]?.[0]})} className="rounded border p-1">Inspect source for bar {i+1}</button>)}{(references?.[index-1]?.[0]||pages?.[index-1])&&(references?.[index]?.[0]||pages?.[index])&&<button onClick={()=>onInspectSource({source,page:references?.[index-1]?.[0]?.page??pages![index-1],crop:references?.[index-1]?.[0],comparePage:references?.[index]?.[0]?.page??pages![index],compareCrop:references?.[index]?.[0]})} className="rounded border p-1">Compare boundary source pages</button>}</div>}
 <div className="grid gap-2 lg:grid-cols-2"><ChartStaffNotation instruments={CHART_INSTRUMENTS.filter(name=>[bars[index-1],bars[index]].some(b=>notesFor(b,name).some(Boolean)||b.rhythmEvents?.some(e=>e.instrument===name)))} bar={bars[index-1]} nextBar={bars[index]} barNumber={index} activeStep={-1}/><ChartStaffNotation instruments={CHART_INSTRUMENTS.filter(name=>[bars[index-1],bars[index]].some(b=>notesFor(b,name).some(Boolean)||b.rhythmEvents?.some(e=>e.instrument===name)))} bar={bars[index]} nextBar={bars[index+1]} barNumber={index+1} activeStep={-1}/></div>
 <label className="block"><input aria-label="Verify continuity source" type="checkbox" checked={verified} onChange={e=>setVerified(e.target.checked)}/>I compared these barlines, duration fragments and fresh strikes against the source.</label>
 {boundaryTieVoices(bars,index).map(voice=>{const end=bars[index-1].rhythmEvents!.find(e=>e.instrument===voice&&e.kind==='note'&&e.step+e.duration===barSlots(bars[index-1]))!,start=bars[index].rhythmEvents!.find(e=>e.instrument===voice&&e.step===0&&e.kind==='note')!;return <label key={voice} className="block"><input aria-label={`Continuity tie ${voice}`} type="checkbox" disabled={!verified} checked={!!start.tieFromPrevious} onChange={e=>{try{onChange(setBoundaryTie(chart,index,voice,e.target.checked).bars);setVerified(false);setMessage('Boundary strike/tie changed. Recheck the updated fragments.')}catch(error){setMessage(error instanceof Error?error.message:'Tie could not change.')}}}/>{voice}: tie across this boundary; combined fragments {end.duration+start.duration} timing slots.</label>})}
 {!boundaryTieVoices(bars,index).length&&<p>No reviewed adjacent note pair. Check coverage, missing rests and source durations first.</p>}
 {!!orphanCount&&<p role="alert">{orphanCount} incoming tie(s) have no preceding reviewed note in this order. Restore the preceding source bar or verify they should become fresh strikes.</p>}
 {!!orphanCount&&<button disabled={!verified} onClick={()=>{onChange(detachOrphanBoundaryTies(chart).bars);setVerified(false)}} className="rounded border p-2">I checked the source; detach orphan incoming ties</button>}
 <p className="text-xs">Edit either fragment below. Overflow remains blocked; use supported fragments on both sides, then source-verify the tie. Changing an ending note may require explicit next-bar tie detachment.</p>
 <ReviewedBarEditor key={JSON.stringify([index-1,bars])} chart={chart} index={index-1} disabled={false} onApply={next=>{onChange(next.bars);setVerified(false)}}/>
 <ReviewedBarEditor key={JSON.stringify([index,bars])} chart={chart} index={index} disabled={false} onApply={next=>{onChange(next.bars);setVerified(false)}}/>
 <p role="status">{message}</p></details>
}
