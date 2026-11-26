import {sameTime} from './rhythmTime'
import { reviewAfterBarEdits } from './chartReviewLogic'
import type { SongChart } from './songChartLogic'
import type { RhythmEvent } from './rhythmTypes'
import { barSlots } from './chartMeter'
import { checkReviewedRhythm, reviewedBar, validReviewedBar } from './reviewedRhythm'
export function reviewedEditTieIssues(chart:SongChart,index:number,events:RhythmEvent[]) {
 const previous=chart.bars[index-1],slots=barSlots(chart.bars[index])
 const incoming=events.flatMap((event,position)=>event.tieFromPrevious&&(event.kind!=='note'||!events.some(note=>note.instrument===event.instrument&&note.kind==='note'&&sameTime(note.step+note.duration,event.step))&&!(event.step===0&&previous?.rhythmEvents?.some(note=>note.instrument===event.instrument&&note.kind==='note'&&sameTime(note.step+note.duration,barSlots(previous)))))?[`Event ${position+1}: ${event.instrument} tie has no adjacent preceding note.`]:[])
 const outgoing=chart.bars[index+1]?.rhythmEvents?.filter(event=>event.step===0&&event.tieFromPrevious&&!events.some(note=>note.instrument===event.instrument&&note.kind==='note'&&sameTime(note.step+note.duration,slots))).map(event=>event.instrument)??[]
 return {incoming,outgoing}
}
/** Validate both bar boundaries before atomically replacing an applied review. */
export function applyReviewedBarEdit(chart:SongChart,index:number,events:RhythmEvent[],detachOutgoing=false):SongChart {
 const original=chart.bars[index]
 if(!original?.rhythmEvents)throw new Error('This bar has no reviewed durations. Review a PDF bar or import supported reviewed MusicXML first.')
 const issues=reviewedEditTieIssues(chart,index,events)
 if(issues.incoming.length||!checkReviewedRhythm(events,barSlots(original),chart.bars[index-1]).valid)throw new Error('Resolve gaps, overlaps, overflows and incoming ties before applying.')
 if(issues.outgoing.length&&!detachOutgoing)throw new Error('This edit breaks ties into the next bar. Restore their preceding notes or explicitly detach them.')
 const bars=[...chart.bars];bars[index]=reviewedBar(events,barSlots(original),bars[index-1])
 if(issues.outgoing.length){const next=bars[index+1];bars[index+1]=reviewedBar(next.rhythmEvents!.map(event=>event.step===0&&issues.outgoing.includes(event.instrument)?{...event,tieFromPrevious:false}:event),barSlots(next),bars[index])}
 if(!bars.every((bar,position)=>validReviewedBar(bar,bars[position-1])))throw new Error('Resolve the remaining chart tie or duration errors before applying.')
 return {...chart,bars,review:reviewAfterBarEdits(chart,bars)}
}
