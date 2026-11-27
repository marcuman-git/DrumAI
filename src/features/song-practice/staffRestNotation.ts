import type {RhythmEvent} from './rhythmTypes'
import type {ChartInstrument} from './chartKit'
import {decomposeTime,timeTick,tickTime} from './rhythmTime'
/** Per-instrument coverage gaps are not source glyphs. Engrave shared silence once, plus explicitly reviewed rests. */
export function staffRestNotation(events:readonly RhythmEvent[],slots:number,instruments:readonly ChartInstrument[],gridStride?:number):RhythmEvent[]{
 const explicit=events.filter(e=>e.kind==='rest'&&(e.restOrigin==='explicit'||e.restOrigin===undefined&&e.sourceAnchor)&&instruments.includes(e.instrument)),occupied=new Set<number>()
 for(const event of [...events.filter(e=>e.kind==='note'),...explicit])for(let tick=timeTick(event.step);tick<timeTick(event.step+event.duration);tick++)occupied.add(tick)
 const instrument=instruments.find(name=>events.some(e=>e.instrument===name))??instruments[0]
 if(!instrument)return []
 const result:RhythmEvent[]=[...explicit];let tick=0
 while(tick<timeTick(slots)){if(occupied.has(tick)){tick++;continue}const start=tick;while(tick<timeTick(slots)&&!occupied.has(tick))tick++;let position=tickTime(start),remaining=tickTime(tick-start)
  try{while(remaining>0){const length=gridStride?Math.min(gridStride,remaining):remaining;for(const fragment of decomposeTime(position,length))result.push({...fragment,instrument,kind:'rest',dynamic:2,restOrigin:'gap'});position+=length;remaining=tickTime(timeTick(remaining-length))}}catch{/* Unsupported sub-tick silence stays in diagnostics rather than inventing a glyph. */}
 }return result.sort((a,b)=>a.step-b.step)
}
