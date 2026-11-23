import {CHART_INSTRUMENTS,notesFor,type ChartBar} from './chartKit'
import type {NoteCandidate} from './notationRecognition'
import type {RhythmEvent} from './rhythmTypes'
export type ConversionStatus='matched'|'missing'|'shifted'|'merged'|'unassigned'|'reviewed-rest'|'continuation'
export function compareSourceConversion(notes:readonly NoteCandidate[],events:readonly RhythmEvent[],bar:ChartBar|null,planned?:Readonly<Record<number,number>>){
 const actual=bar?bar.rhythmEvents?bar.rhythmEvents.filter(e=>e.kind==='note'&&!e.tieFromPrevious).map(e=>({instrument:e.instrument,step:e.step})):CHART_INSTRUMENTS.flatMap(instrument=>notesFor(bar,instrument).flatMap((v,step)=>v?[{instrument,step}]:[])):[]
 const expected=notes.map(note=>{const event=events.find(e=>e.sourceCandidateId===note.id);return {note,event,instrument:event?.instrument??note.instrument,step:event?.step??planned?.[note.id]}})
 const keys=expected.filter(e=>e.step!==undefined&&e.event?.kind!=='rest'&&!e.event?.tieFromPrevious).map(e=>`${e.instrument}:${e.step}`)
 const used=new Set<number>();const assigned=expected.map(e=>{if(e.event?.kind==='rest')return {...e,status:'reviewed-rest' as ConversionStatus,actualStep:null};if(e.event?.tieFromPrevious)return {...e,status:'continuation' as ConversionStatus,actualStep:null};if(e.step===undefined)return {...e,status:'unassigned' as ConversionStatus,actualStep:null};const key=`${e.instrument}:${e.step}`,matches=actual.map((a,i)=>({...a,i})).filter(a=>a.instrument===e.instrument&&a.step===e.step);const needed=keys.filter(k=>k===key).length;if(needed>matches.length&&needed>1){matches.forEach(a=>used.add(a.i));return {...e,status:'merged' as ConversionStatus,actualStep:matches[0]?.step??null}};const exact=matches.find(a=>!used.has(a.i));if(exact){used.add(exact.i);return {...e,status:'matched' as ConversionStatus,actualStep:exact.step}}return {...e,status:'missing' as ConversionStatus,actualStep:null}})
 // Reserve exact matches before assigning nearby strokes, so one shifted hit cannot steal another head's correct onset.
 const rows=[...assigned],moved=new Set<number>()
 const pairs=rows.flatMap((row,r)=>row.status==='missing'?actual.flatMap((a,i)=>a.instrument===row.instrument&&!used.has(i)?[{r,i,distance:Math.abs(a.step-row.step!)}]:[]):[]).sort((a,b)=>a.distance-b.distance)
 for(const pair of pairs)if(!moved.has(pair.r)&&!used.has(pair.i)){used.add(pair.i);moved.add(pair.r);rows[pair.r]={...rows[pair.r],status:'shifted',actualStep:actual[pair.i].step}}
 return {rows,summary:{checked:notes.length,reviewedHeads:events.filter(e=>e.sourceCandidateId!==undefined).length,chartStrikes:actual.length,matched:rows.filter(r=>r.status==='matched').length,missing:rows.filter(r=>r.status==='missing').length,shifted:rows.filter(r=>r.status==='shifted').length,merged:rows.filter(r=>r.status==='merged').length,unassigned:rows.filter(r=>r.status==='unassigned').length},extraStrikes:actual.filter((_,i)=>!used.has(i))}
}
