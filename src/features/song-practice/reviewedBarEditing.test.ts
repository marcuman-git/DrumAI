import { expect,it } from 'vitest'
import { newSongChart,isSongChart } from './songChartLogic'
import { reviewedBar } from './reviewedRhythm'
import { applyReviewedBarEdit,reviewedEditTieIssues } from './reviewedBarEditing'
import { setBoundaryTie } from './chartTieReview'
import { exportReviewedMusicXml } from './musicXmlExport'
import { importMusicXml } from './musicXmlImport'
import type { RhythmEvent } from './rhythmTypes'
const events:RhythmEvent[]=[{instrument:'Snare',step:0,duration:2,kind:'note',dynamic:2},{instrument:'Snare',step:2,duration:2,kind:'rest',dynamic:2},{instrument:'Snare',step:4,duration:4,kind:'note',dynamic:2}]
function chartFor(){return {...newSongChart(),meter:'2/4' as const,bars:[reviewedBar(events,8)]}}
it('applies a valid dotted-duration review atomically and retains XML/JSON-compatible chart data',()=>{
 const chart=chartFor();const draft=events.map((event,index)=>index===0?{...event,duration:3 as const}:index===1?{...event,step:3,duration:1 as const}:event)
 const applied=applyReviewedBarEdit(chart,0,draft);expect(isSongChart(applied)).toBe(true);expect(chart.bars[0].rhythmEvents![0].duration).toBe(2)
 expect(applied.bars[0].rhythmEvents![0].duration).toBe(3);expect(importMusicXml(exportReviewedMusicXml(applied.bars)).bars[0].rhythmEvents![0].duration).toBe(3)
})
it('blocks gaps, overlap, overflow and orphan incoming ties without changing the applied bar',()=>{
 const chart=chartFor(),original=JSON.stringify(chart)
 for(const draft of [events.slice(0,2),events.map((event,index)=>index===0?{...event,duration:3 as const}:event),events.map((event,index)=>index===2?{...event,duration:6 as const}:event),events.map((event,index)=>index===0?{...event,tieFromPrevious:true}:event)])expect(()=>applyReviewedBarEdit(chart,0,draft)).toThrow('Resolve')
 expect(JSON.stringify(chart)).toBe(original)
})
it('requires explicit detachment of outgoing ties when an ending note becomes a rest',()=>{
 const chart=chartFor();chart.bars.push(reviewedBar(events,8));const tied=setBoundaryTie(chart,1,'Snare',true)
 const draft=events.map((event,index)=>index===2?{...event,kind:'rest' as const}:event)
 expect(reviewedEditTieIssues(tied,0,draft).outgoing).toEqual(['Snare'])
 expect(()=>applyReviewedBarEdit(tied,0,draft)).toThrow('breaks ties')
 const applied=applyReviewedBarEdit(tied,0,draft,true);expect(isSongChart(applied)).toBe(true);expect(applied.bars[1].Snare[0]).toBe(2);expect(applied.bars[1].rhythmEvents![0].tieFromPrevious).toBeUndefined()
 expect(tied.bars[1].Snare[0]).toBe(0)
})
it('identifies orphan within-bar and cross-bar ties separately from coverage diagnostics',()=>{
 const chart=chartFor();const draft=events.map((event,index)=>index===2?{...event,tieFromPrevious:true}:event)
 expect(reviewedEditTieIssues(chart,0,draft).incoming[0]).toContain('Event 3')
 expect(()=>applyReviewedBarEdit(newSongChart(),0,events)).toThrow('no reviewed durations')
})
it('detaches only affected outgoing voices while preserving other boundary ties',()=>{
 const chart=chartFor();const combined=[...events,...events.map(event=>({...event,instrument:'Ride' as const}))]
 chart.bars=[reviewedBar(combined,8),reviewedBar(combined,8)]
 const tied=setBoundaryTie(setBoundaryTie(chart,1,'Snare',true),1,'Ride',true)
 const draft=combined.map(event=>event.instrument==='Snare'&&event.step===4?{...event,kind:'rest' as const}:event)
 const applied=applyReviewedBarEdit(tied,0,draft,true)
 expect(applied.bars[1].Snare[0]).toBe(2);expect(applied.bars[1].Ride![0]).toBe(0)
 expect(applied.bars[1].rhythmEvents!.find(event=>event.instrument==='Ride'&&event.step===0)?.tieFromPrevious).toBe(true)
})

import {newChartReview,barSignature} from './chartReviewLogic'
it('retains source pages and notes through duration edits and affected next-bar detachment, but resets their verification',()=>{
 const chart=chartFor();chart.bars.push(reviewedBar(events,8));chart.bars.push(reviewedBar(events,8))
 const tied=setBoundaryTie(chart,1,'Snare',true);const review=newChartReview(tied);review.source='study.pdf';review.bars=review.bars.map((reference,index)=>({...reference,page:index+2,notes:'Compare this bar',status:'Reviewed',signature:barSignature(tied.bars[index])}))
 const original={...tied,review};const result=applyReviewedBarEdit(original,0,events.map(event=>event.step===4?{...event,kind:'rest' as const}:event),true)
 expect(result.review?.source).toBe('study.pdf');expect(result.review?.bars.map(bar=>bar.page)).toEqual([2,3,4]);expect(result.review?.bars.map(bar=>bar.status)).toEqual(['Pending','Pending','Reviewed']);expect(result.review?.bars[0].signature).toBe('');expect(result.review?.bars[1].notes).toBe('Compare this bar');expect(isSongChart(JSON.parse(JSON.stringify(result)))).toBe(true);expect(original.review.bars[0].status).toBe('Reviewed')
 const retied=setBoundaryTie(original,1,'Snare',false);expect(retied.review?.source).toBe('study.pdf')
})
