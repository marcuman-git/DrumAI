import { reviewAfterBarEdits } from './chartReviewLogic'
import { CHART_INSTRUMENTS, notesFor } from './chartKit'
import type { ChartBar, ChartInstrument } from './chartKit'
import type { SongChart } from './songChartLogic'
import { checkReviewedRhythm, reviewedBar, validReviewedBar } from './reviewedRhythm'
const slots=(bar:ChartBar)=>bar.beats===2?8:16
export function boundaryTieVoices(bars:ChartBar[], index:number):ChartInstrument[] {
 if(index<1||!bars[index]?.rhythmEvents||!bars[index-1]?.rhythmEvents)return []
 return CHART_INSTRUMENTS.filter(instrument=>bars[index].rhythmEvents!.some(event=>event.instrument===instrument&&event.step===0&&event.kind==='note')&&bars[index-1].rhythmEvents!.some(event=>event.instrument===instrument&&event.kind==='note'&&event.step+event.duration===slots(bars[index-1])))
}
/** Called only after the user compares both bar ends with the source. */
export function setBoundaryTie(chart:SongChart,index:number,instrument:ChartInstrument,tied:boolean):SongChart {
 if(!boundaryTieVoices(chart.bars,index).includes(instrument))throw new Error('Both bars need reviewed adjacent notes in this voice.')
 if(!chart.bars.every((bar,position)=>validReviewedBar(bar,chart.bars[position-1])))throw new Error('Resolve reviewed bar errors before changing a tie.')
 const events=chart.bars[index].rhythmEvents!.map(event=>event.instrument===instrument&&event.step===0?{...event,tieFromPrevious:tied}:event)
 const bar=reviewedBar(events,slots(chart.bars[index]),chart.bars[index-1])
 const bars=chart.bars.map((value,position)=>position===index?bar:value)
 return {...chart,bars,review:reviewAfterBarEdits(chart,bars)}
}
/** Editing/deleting the preceding reviewed bar must not leave a silent orphan continuation. */
export function detachOrphanBoundaryTies(chart:SongChart, previousChart?:SongChart):SongChart {
 let changed=false
 const bars=chart.bars.map((bar,index)=>{
  const events=bar.rhythmEvents
  if(!events?.some(event=>event.step===0&&event.tieFromPrevious))return bar
  const previous=chart.bars[index-1]
  const oldIndex=previousChart?.bars.indexOf(bar)??-1
  const oldPrevious=previousChart?.bars[oldIndex>=0?oldIndex-1:index-1]
  const structuralChange=!!previousChart&&(previousChart.meter??'4/4')===(chart.meter??'4/4')&&previousChart.bars.length!==chart.bars.length
  const adjacencyChanged=structuralChange&&(oldIndex<0||oldPrevious!==previous)
  const updated=events.map(event=>event.step===0&&event.tieFromPrevious&&(adjacencyChanged||!previous?.rhythmEvents?.some(note=>note.instrument===event.instrument&&note.kind==='note'&&note.step+note.duration===slots(previous)))?{...event,tieFromPrevious:false}:event)
  if(updated.every((event,position)=>event===events[position]))return bar
  changed=true
  return {...bar,...Object.fromEntries(CHART_INSTRUMENTS.map(instrument=>[instrument,notesFor(bar,instrument).map((note,step)=>step===0?updated.find(event=>event.instrument===instrument&&event.step===0&&event.kind==='note'&&!event.tieFromPrevious)?.dynamic??note:note)])),rhythmEvents:updated}
 })
 return changed?{...chart,bars,review:reviewAfterBarEdits(chart,bars)}:chart
}
export function chartPlaybackNote(bar:ChartBar,instrument:ChartInstrument,step:number,sectionEntry=false):number {
 return notesFor(bar,instrument)[step] || (sectionEntry&&step===0?bar.rhythmEvents?.find(event=>event.instrument===instrument&&event.step===0&&event.kind==='note'&&event.tieFromPrevious)?.dynamic??0:0)
}
export function reviewedChartComplete(bars:ChartBar[]) {return bars.every((bar,index)=>!!bar.rhythmEvents&&validReviewedBar(bar,bars[index-1])&&checkReviewedRhythm(bar.rhythmEvents!,slots(bar),bars[index-1]).valid)}
