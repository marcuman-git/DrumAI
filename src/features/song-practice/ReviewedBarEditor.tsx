import { useState } from 'react'
import type { SongChart } from './songChartLogic'
import { CHART_INSTRUMENTS } from './chartKit'
import type { ChartInstrument } from './chartKit'
import type { RhythmEvent } from './rhythmTypes'
import { barSlots } from './chartMeter'
import { checkReviewedRhythm, reviewedBar } from './reviewedRhythm'
import { diagnoseReviewedRhythm, fillNextReviewedGap, formatSlotRanges } from './reviewedRhythmDiagnostics'
import { reviewedEditTieIssues, applyReviewedBarEdit } from './reviewedBarEditing'
import { ChartStaffNotation } from './ChartStaffNotation'
export function ReviewedBarEditor({chart,index,disabled,onApply}:{chart:SongChart;index:number;disabled:boolean;onApply:(chart:SongChart)=>void}) {
 const [events,setEvents]=useState<RhythmEvent[]>(()=>structuredClone(chart.bars[index].rhythmEvents??[]))
 const [verified,setVerified]=useState(false),[detach,setDetach]=useState(false)
 const [instrument,setInstrument]=useState<ChartInstrument>('Snare')
 const [message,setMessage]=useState('')
 const bar=chart.bars[index],slots=barSlots(bar)
 const check=checkReviewedRhythm(events,slots,chart.bars[index-1]),ties=reviewedEditTieIssues(chart,index,events)
 const comparable=(values:RhythmEvent[])=>JSON.stringify(values.map(({tieFromPrevious,...event})=>({...event,...(tieFromPrevious?{tieFromPrevious:true}:{})})))
 const dirty=comparable(events)!==comparable(bar.rhythmEvents??[])
 const nextBar=chart.bars[index+1]
 const previewNext=nextBar?{...nextBar,rhythmEvents:nextBar.rhythmEvents?.map(event=>detach&&event.step===0&&ties.outgoing.includes(event.instrument)?{...event,tieFromPrevious:false}:event)}:undefined
 function edit(next:RhythmEvent[]){setEvents(next);setVerified(false);setDetach(false);setMessage('Draft updated. Playback and saving use the applied chart until you apply this review.')}
 if(!bar.rhythmEvents)return <p className="text-xs text-zinc-400">This bar uses grid timing. Reviewed-duration editing is available after confirming a PDF review or importing complete supported reviewed MusicXML.</p>
 return <details className="space-y-2 rounded border border-cyan-300/40 p-3" aria-label="Edit reviewed bar durations"><summary className="cursor-pointer font-semibold">Edit reviewed durations — Bar {index+1}{dirty?' (unapplied edits)':''}</summary>
 <p className="text-xs">Edit onset slots, durations, rests, voices and ties. Apply or discard before switching bars or changing the chart; unapplied edits reset when the chart changes. Playback uses the applied chart. Chart Undo restores applied reviews.</p>
 <fieldset disabled={disabled} className="space-y-2">
 <label>New event voice<select aria-label="Reviewed edit new voice" value={instrument} onChange={event=>setInstrument(event.target.value as ChartInstrument)} className="rounded bg-zinc-900 p-1">{CHART_INSTRUMENTS.map(name=><option key={name}>{name}</option>)}</select></label>
 <button disabled={events.length>=192} onClick={()=>edit([...events,{instrument,step:0,duration:2,kind:'note',dynamic:2}])} className="m-1 rounded border p-1">Add duration-reviewed note</button><button onClick={()=>edit(fillNextReviewedGap(events,instrument,slots))} className="m-1 rounded border p-1">Fill next reviewed gap with rests</button>
 <div className="max-h-80 space-y-2 overflow-y-auto">{events.map((event,position)=><div key={position} id={`reviewed-edit-event-${position}`} className="flex flex-wrap gap-2 rounded border border-white/20 p-2 text-xs"><span>Event {position+1}</span>
 <select aria-label={`Reviewed event ${position+1} voice`} value={event.instrument} onChange={input=>edit(events.map((item,i)=>i===position?{...item,instrument:input.target.value as ChartInstrument}:item))} className="rounded bg-zinc-900 p-1">{CHART_INSTRUMENTS.map(name=><option key={name}>{name}</option>)}</select>
 <label>Slot<input aria-label={`Reviewed event ${position+1} slot`} type="number" min={1} max={slots} value={event.step+1} onChange={input=>{const step=Number(input.target.value)-1;if(Number.isInteger(step)&&step>=0&&step<slots)edit(events.map((item,i)=>i===position?{...item,step}:item))}} className="w-14 rounded bg-zinc-900 p-1"/></label>
 <select aria-label={`Reviewed event ${position+1} duration`} value={event.duration} onChange={input=>edit(events.map((item,i)=>i===position?{...item,duration:Number(input.target.value) as RhythmEvent['duration']}:item))} className="rounded bg-zinc-900 p-1">{([[1,'Sixteenth'],[2,'Eighth'],[3,'Dotted eighth'],[4,'Quarter'],[6,'Dotted quarter']] as const).map(([value,label])=><option key={value} value={value}>{label}</option>)}</select>
 <select aria-label={`Reviewed event ${position+1} kind`} value={event.kind} onChange={input=>edit(events.map((item,i)=>i===position?{...item,kind:input.target.value as RhythmEvent['kind']}:item))} className="rounded bg-zinc-900 p-1"><option>note</option><option>rest</option></select>
 <select aria-label={`Reviewed event ${position+1} dynamic`} value={event.dynamic} onChange={input=>edit(events.map((item,i)=>i===position?{...item,dynamic:Number(input.target.value) as RhythmEvent['dynamic']}:item))} className="rounded bg-zinc-900 p-1"><option value={1}>Ghost</option><option value={2}>Normal</option><option value={3}>Accent</option></select>
 <label><input aria-label={`Reviewed event ${position+1} tie`} type="checkbox" checked={!!event.tieFromPrevious} onChange={input=>edit(events.map((item,i)=>i===position?{...item,tieFromPrevious:input.target.checked}:item))}/>Tie from adjacent preceding note</label>
 <button onClick={()=>edit(events.filter((_,i)=>i!==position))} className="rounded border p-1">Remove reviewed event {position+1}</button></div>)}</div>
 <section aria-label="Reviewed edit diagnostics">{diagnoseReviewedRhythm(events,slots).map(voice=><p key={voice.instrument}>{voice.instrument}: gaps {formatSlotRanges(voice.gaps)}; overlaps {formatSlotRanges(voice.overlaps)}; overflow events {voice.overflowEvents.map(i=>i+1).join(', ')||'none'}. {[...new Set([...voice.conflictEvents,...voice.overflowEvents])].map(i=><button key={i} onClick={()=>{const row=document.getElementById(`reviewed-edit-event-${i}`);row?.scrollIntoView?.({block:'nearest'});row?.querySelector('input')?.focus()}} className="m-1 rounded border p-1">Inspect event {i+1}</button>)}</p>)}{ties.incoming.map(issue=><p key={issue} role="alert">{issue}</p>)}{ties.outgoing.length>0&&<p role="alert">This edit removes the preceding note for next-bar ties: {ties.outgoing.join(', ')}.</p>}</section>
 {ties.outgoing.length>0&&<label className="block"><input aria-label="Detach affected next-bar ties" type="checkbox" checked={detach} onChange={event=>{setDetach(event.target.checked);setVerified(false)}}/>I verified these next-bar notes should become fresh strikes; detach their ties.</label>}
 {check.valid&&<ChartStaffNotation bar={reviewedBar(events,slots,chart.bars[index-1])} nextBar={previewNext} barNumber={index+1} activeStep={-1} instruments={CHART_INSTRUMENTS.filter(name=>events.some(event=>event.instrument===name))}/>}
 <label className="block"><input aria-label="Verify edited durations against source" type="checkbox" disabled={!check.valid||ties.incoming.length>0||ties.outgoing.length>0&&!detach} checked={verified} onChange={event=>setVerified(event.target.checked)}/>I verified these edited durations, onsets, rests and ties against the source.</label>
 <button disabled={!dirty||!verified||!check.valid||ties.incoming.length>0||ties.outgoing.length>0&&!detach} onClick={()=>{try{onApply(applyReviewedBarEdit(chart,index,events,detach));setVerified(false);setMessage('Reviewed edits applied. Chart Undo can restore the previous bar.')}catch(error){setMessage(error instanceof Error?error.message:'Review could not be applied.')}}} className="m-1 rounded border p-2">Apply reviewed duration edits</button>
 <button disabled={!dirty} onClick={()=>{setEvents(structuredClone(bar.rhythmEvents!));setVerified(false);setDetach(false);setMessage('Unapplied edits discarded.')}} className="m-1 rounded border p-2">Discard reviewed duration edits</button>
 </fieldset><p role="status" className="text-xs">{message}</p></details>
}
