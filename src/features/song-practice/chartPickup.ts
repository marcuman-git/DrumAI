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
