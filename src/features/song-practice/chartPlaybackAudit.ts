import {CHART_INSTRUMENTS,notesFor} from './chartKit'
import {chartScheduledHits} from './chartScheduledHits'
import {chartSlots} from './chartMeter'
import {chartSection} from './songChartLogic'
import type {SongChart} from './songChartLogic'
import {playbackStart} from './chartPickup'
import {defaultMix,mixLevel} from './chartPracticeSettings'
/** Actual section attacks, including entry ties and grace strokes. Display grouping is irrelevant. */
export function chartPlaybackAudit(chart:SongChart){
 const section=chartSection(chart),slots=chartSlots(chart),first=playbackStart(chart,section.start)
 return chart.bars.flatMap((bar,index)=>index<section.start||index>section.end?[]:CHART_INSTRUMENTS.flatMap(instrument=>Array.from({length:slots},(_,slot)=>index*slots+slot<first?[]:chartScheduledHits(bar,instrument,slot,index*slots+slot===first).map(hit=>({bar:index,instrument,step:slot+hit.offset,grace:hit.grace??0,muted:mixLevel(chart.mix??defaultMix(),instrument)<=0,projected:notesFor(bar,instrument)[slot]}))).flat()))
}
