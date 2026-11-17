import { CHART_INSTRUMENTS, completeBar, notesFor } from './chartKit'
import type { ChartBar } from './chartKit'
import type { RhythmEvent } from './rhythmTypes'
import type { SongChart } from './songChartLogic'
import { reviewedBar, validReviewedBar } from './reviewedRhythm'
export type ChartMeter = '2/4' | '4/4'
export function barSlots(bar: ChartBar) { return bar.beats === 2 ? 8 : 16 }
export function chartSlots(chart: SongChart) { return chart.meter === '2/4' ? 8 : 16 }
/** Decompose unusual split fragments into supported values; note fragments continue with ties. */
function fragments(event:RhythmEvent,start:number,length:number,continuation:boolean):RhythmEvent[] {
 const result:RhythmEvent[]=[]
 while(length){const duration=([6,4,3,2,1] as const).find(value=>value<=length)!;result.push({...event,step:start,duration,...(event.kind==='note'?{tieFromPrevious:continuation}: {tieFromPrevious:undefined})});start+=duration;length-=duration;continuation=event.kind==='note'}
 return result
}
export function changeChartMeter(chart: SongChart, meter: ChartMeter): SongChart {
 if ((chart.meter ?? '4/4') === meter) return chart
 if(!chart.bars.every((bar,index)=>validReviewedBar(bar,chart.bars[index-1])))throw new Error('Resolve invalid reviewed rhythm before meter conversion.')
 const bars: ChartBar[] = []; const labels: string[] = []
 if (meter === '2/4') {
  if (chart.bars.length > 8) throw new Error('Splitting would exceed 16 bars. Use a shorter chart first.')
  chart.bars.forEach((bar, index) => {
   for (const offset of [0, 8]) {
    let half: ChartBar = { ...completeBar(), beats: 2 }
    if(bar.rhythmEvents){
     const events=bar.rhythmEvents.flatMap(event=>{const start=Math.max(offset,event.step);const end=Math.min(offset+8,event.step+event.duration);return end>start?fragments(event,start-offset,end-start,!!event.tieFromPrevious||start>event.step):[]})
     half=reviewedBar(events,8,bars[bars.length-1])
    } else for(const instrument of CHART_INSTRUMENTS)half[instrument]=[...notesFor(bar,instrument).slice(offset,offset+8),...Array<number>(8).fill(0)]
    bars.push(half);labels.push((chart.barLabels?.[index]?`${chart.barLabels[index]} ${offset?'B':'A'}`:'').slice(0,40))
   }
  })
 } else {
  if(chart.bars.length%2)throw new Error('Add a second 2/4 bar before joining pairs into 4/4.')
  for(let index=0;index<chart.bars.length;index+=2){
   const left=chart.bars[index],right=chart.bars[index+1]
   if(!!left.rhythmEvents!==!!right.rhythmEvents)throw new Error('Both joined bars must have reviewed durations, or both must be grid-only.')
   let joined:ChartBar=completeBar()
   if(left.rhythmEvents&&right.rhythmEvents){
    // Absent voices in either half are explicitly silent, not an incomplete joined review.
    const voices=CHART_INSTRUMENTS.filter(name=>[...left.rhythmEvents!,...right.rhythmEvents!].some(event=>event.instrument===name))
    const events=voices.flatMap(instrument=>[left,right].flatMap((bar,half)=>bar.rhythmEvents!.some(event=>event.instrument===instrument)?bar.rhythmEvents!.filter(event=>event.instrument===instrument).map(event=>({...event,step:event.step+half*8})):[{instrument,step:half*8,duration:4 as const,kind:'rest' as const,dynamic:2 as const},{instrument,step:half*8+4,duration:4 as const,kind:'rest' as const,dynamic:2 as const}]))
    joined=reviewedBar(events,16,bars[bars.length-1])
   } else for(const instrument of CHART_INSTRUMENTS)joined[instrument]=[...notesFor(left,instrument).slice(0,8),...notesFor(right,instrument).slice(0,8)]
   bars.push(joined);labels.push([chart.barLabels?.[index],chart.barLabels?.[index+1]].filter(Boolean).join(' / ').slice(0,40))
  }
 }
 return {...chart,meter,bars,barLabels:labels,section:undefined,review:undefined}
}
