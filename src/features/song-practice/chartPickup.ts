import { chartSlots } from './chartMeter'
import { CHART_INSTRUMENTS, notesFor } from './chartKit'
import type { SongChart } from './songChartLogic'
/** A pickup skips silence only; later edits cannot silently hide a strike. */
export function validPickup(chart: SongChart): boolean {
 const offset=chart.pickupOffset
 if(offset===undefined)return true
 if(!Number.isInteger(offset)||offset<1||offset>=chartSlots(chart)||!chart.bars?.[0])return false
 const bar=chart.bars[0]
 return CHART_INSTRUMENTS.every(name=>notesFor(bar,name).slice(0,offset).every(note=>note===0)) && !bar.rhythmEvents?.some(event=>event.kind==='note'&&event.step<offset)
}
export function playbackStart(chart: SongChart, startBar: number): number {
 return startBar*chartSlots(chart)+(startBar===0&&validPickup(chart)?chart.pickupOffset??0:0)
}

export interface ReviewedPickup { offset:number; signature:string }
export function pickupReviewSignature(bar: import('./chartKit').ChartBar,source?:string,page?:number,crop?:import('./sourceTrace').SourceCrop):string {
 return JSON.stringify([bar,source,page,crop])
}
export function validDraftPickup(draft:import('./notationRecognition').RecognitionDraft):boolean {
 if(draft.pickup===undefined)return true
 const bar=(draft.bars??[draft.bar])[0],crop=draft.references?.[0]?.[0],page=crop?.page??draft.pages?.[0]??draft.page
 return !!draft.pickup&&typeof draft.pickup.signature==='string'&&draft.pickup.signature===pickupReviewSignature(bar,draft.source,page,crop)
  && validPickup({bars:[bar],meter:bar?.beats===2?'2/4':'4/4',pickupOffset:draft.pickup.offset} as SongChart)
}
