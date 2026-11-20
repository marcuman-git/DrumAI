import {pickupReviewSignature,type ReviewedPickup} from './chartPickup'
import {useState,useEffect,useEffectEvent} from 'react'
import type {ChartBar} from './chartKit'
import {CHART_INSTRUMENTS,notesFor} from './chartKit'
import {barSlots} from './chartMeter'
import {ChartStaffNotation} from './ChartStaffNotation'
import type {SourceCrop} from './sourceTrace'
import type {SourceReferenceRequest} from './sourceReferenceNavigation'
/** Comparison only: reviewed notation stays full-bar; the editor owns saved playback timing. */
export function PickupTimingComparison({bar,source,page,crop,onInspectSource,onPickupChange}:{onPickupChange?:(pickup:ReviewedPickup|null)=>void;bar:ChartBar;source?:string;page?:number;crop?:SourceCrop;onInspectSource?:(request:SourceReferenceRequest)=>void}){
 const signature=pickupReviewSignature(bar,source,page,crop)
 const [review,setReview]=useState({signature:'',verified:false,offset:0}),[bpm,setBpm]=useState(60)
 if(review.signature!==signature)setReview({signature,verified:false,offset:0})
 const current=review.signature===signature?review:{signature,verified:false,offset:0}
 const notifyPickup=useEffectEvent(()=>onPickupChange?.(current.verified&&current.offset>0?{offset:current.offset,signature}:null))
 useEffect(()=>notifyPickup(),[current.verified,current.offset,signature])
 const slots=barSlots(bar)
 const firstOnset=Math.min(...Array.from({length:slots},(_,i)=>i).filter(step=>CHART_INSTRUMENTS.some(name=>notesFor(bar,name)[step]>0)||bar.rhythmEvents?.some(e=>e.kind==='note'&&e.step===step)))
 const maxOffset=Number.isFinite(firstOnset)?firstOnset:0
 return <details aria-label="Source pickup timing comparison" className="rounded border p-3"><summary>Compare first-bar pickup timing</summary>
 <p>Check whether the source starts with measured rests or a shortened pickup. This comparison preserves reviewed durations. A verified offset can travel with the draft for explicit new-chart creation.</p>
 {source&&onInspectSource&&(crop||page)&&<button className="rounded border p-2" onClick={()=>onInspectSource({source,page:crop?.page??page!,crop})}>Inspect pickup source</button>}
 <ChartStaffNotation bar={bar} barNumber={1} activeStep={-1} initialCountMode="eighth" instruments={CHART_INSTRUMENTS.filter(name=>notesFor(bar,name).some(Boolean)||bar.rhythmEvents?.some(e=>e.instrument===name))}/>
 <label className="block">Comparison tempo<select aria-label="Pickup comparison tempo" value={bpm} onChange={e=>setBpm(Number(e.target.value))} className="m-2 rounded bg-zinc-900 p-1">{[40,60,80,100,120,160,200,240].map(v=><option key={v}>{v}</option>)}</select></label>
 <label className="block"><input aria-label="Verify pickup source" type="checkbox" checked={current.verified} onChange={e=>setReview({signature,verified:e.target.checked,offset:0})}/>I compared the first-bar timing against the source.</label>
 <label className="block">Timing comparison<select aria-label="Pickup comparison offset" disabled={!current.verified||!maxOffset} value={current.offset} onChange={e=>setReview({...current,signature,offset:Number(e.target.value)})} className="m-2 rounded bg-zinc-900 p-1"><option value={0}>Full bar</option>{Array.from({length:maxOffset},(_,i)=>i+1).map(offset=><option key={offset} value={offset}>Skip {offset} leading silent sixteenth slots</option>)}</select></label>
 <p role="status">At {bpm} BPM: full bar {(slots*15/bpm).toFixed(2)} seconds; compared timing {((slots-current.offset)*15/bpm).toFixed(2)} seconds, excluding count-in.</p>
 {!maxOffset&&<p>No leading silence before a strike was found. A wholly silent bar is not a pickup candidate.</p>}
 {current.offset>0&&<p>After sending, Create new chart from reviewed draft applies this verified {current.offset}-slot offset to its first bar. Appending to existing bars preserves the existing chart pickup.</p>}
 </details>
}
