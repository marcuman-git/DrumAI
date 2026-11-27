import {expect,it} from 'vitest'
import {resolveMusicalTiming} from './musicalTiming'
import {reviewedBar} from './reviewedRhythm'
import {attachSourceAnchors} from './sourceTrace'
import {createChartFromDraft,appendReviewedDraft} from './chartDraftWorkflow'
import {changeChartMeter} from './chartMeter'
import {parseSongChart,isSongChart,newSongChart} from './songChartLogic'
import {chartScheduledHits} from './chartScheduledHits'
import type {NoteCandidate} from './notationRecognition'
import type {NoteValueHint} from './noteValueHints'
it('preserves resolved onsets, source points and durations through staging, append, meter conversion, JSON and scheduled playback',()=>{
 const notes:NoteCandidate[]=Array.from({length:8},(_,id)=>({id,x:[12,30,70,98,129,158,220,298][id],y:40,instrument:'Hi-hat',shape:'cross',strength:1,stemHint:true,flagHint:false})),hints:Record<number,NoteValueHint>=Object.fromEntries(notes.map(n=>[n.id,{value:'eighth',stemDirection:'up',beamBands:1,contextNeighbours:[n.id-1,n.id+1].filter(id=>id>=0&&id<8),left:0,top:0,width:20,height:40}]))
 const events=resolveMusicalTiming(notes,hints,{slots:16,gap:10}).proposals[0].events,crop={page:2,region:{x:.1,y:.2,width:.8,height:.2}},bar=attachSourceAnchors(reviewedBar(events),events,notes,{width:320,height:100,angle:0},crop),draft={bar,source:'source.pdf',page:2,references:[[crop]]},chart=createChartFromDraft(draft)
 expect(chart.bars[0].rhythmEvents?.[7].sourceAnchor?.x).toBeCloseTo(.1+298/320*.8)
 const appended=appendReviewedDraft({...newSongChart(),bars:[bar]},draft);expect(isSongChart(appended)).toBe(true)
 const split=changeChartMeter(chart,'2/4');expect(split.bars).toHaveLength(2);const restored=parseSongChart(JSON.stringify({app:'DrumMaster AI Chart',schema:1,chart:split}));expect(restored.bars).toEqual(split.bars)
 expect(restored.bars.flatMap(b=>Array.from({length:8},(_,slot)=>chartScheduledHits(b,'Hi-hat',slot).map(h=>({slot,offset:h.offset}))).flat())).toHaveLength(8)
 expect(changeChartMeter(restored,'4/4').bars[0].rhythmEvents?.filter(e=>e.kind==='note')).toEqual(bar.rhythmEvents)
})
it('refuses grid conversion of fine onsets instead of dropping or merging strokes',async()=>{const {withoutReviewedDurations}=await import('./chartKit');const {cycleChartNote}=await import('./songChartLogic');const bar=reviewedBar([{instrument:'Snare',step:0,duration:.5,kind:'note',dynamic:2},{instrument:'Snare',step:.5,duration:.5,kind:'note',dynamic:2},{instrument:'Snare',step:1,duration:1,kind:'rest',dynamic:2},{instrument:'Snare',step:2,duration:6,kind:'rest',dynamic:2}],8),chart={...newSongChart(),meter:'2/4' as const,bars:[bar]};expect(()=>withoutReviewedDurations(bar)).toThrow('Fine onsets');expect(cycleChartNote(chart,0,'Snare',0)).toBe(chart);expect(chart.bars[0].rhythmEvents?.filter(e=>e.kind==='note')).toHaveLength(2)})
