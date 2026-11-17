import { expect,it } from 'vitest'
import { render,screen } from '@testing-library/react'
import { reviewedBar,fillReviewedRests,validReviewedBar } from './reviewedRhythm'
import { boundaryTieVoices,setBoundaryTie,detachOrphanBoundaryTies,chartPlaybackNote } from './chartTieReview'
import { changeChartMeter } from './chartMeter'
import { newSongChart,isSongChart,cycleChartNote,parseSongChart } from './songChartLogic'
import { exportReviewedMusicXml } from './musicXmlExport'
import { importMusicXml } from './musicXmlImport'
import { ChartStaffNotation } from './ChartStaffNotation'
function pair(){const chart=newSongChart();chart.meter='2/4';chart.bars=[reviewedBar(fillReviewedRests([{instrument:'Ride',step:6,duration:2,kind:'note',dynamic:3}],'Ride',8),8),reviewedBar(fillReviewedRests([{instrument:'Ride',step:0,duration:4,kind:'note',dynamic:2}],'Ride',8),8)];return chart}
it('validates cross-bar continuations in context and preserves them in JSON and XML',()=>{
 const chart=setBoundaryTie(pair(),1,'Ride',true)
 expect(boundaryTieVoices(chart.bars,1)).toEqual(['Ride']);expect(isSongChart(chart)).toBe(true)
 expect(validReviewedBar(chart.bars[1])).toBe(false);expect(validReviewedBar(chart.bars[1],chart.bars[0])).toBe(true)
 expect(chartPlaybackNote(chart.bars[1],'Ride',0)).toBe(0);expect(chartPlaybackNote(chart.bars[1],'Ride',0,true)).toBe(2)
 const parsed=parseSongChart(JSON.stringify({app:'DrumMaster AI Chart',schema:1,chart}));expect(parsed.bars[1].rhythmEvents!.find(event=>event.step===0)?.tieFromPrevious).toBe(true)
 const imported=importMusicXml(exportReviewedMusicXml(chart.bars));expect(isSongChart(imported)).toBe(true);expect(imported.bars[1].Ride![0]).toBe(0)
 expect(imported.bars[1].rhythmEvents!.find(event=>event.step===0)?.tieFromPrevious).toBe(true)
 expect(()=>exportReviewedMusicXml([chart.bars[1]])).toThrow('complete reviewed')
})
it('splits crossing durations into tied supported fragments and joins without new onsets',()=>{
 const chart=newSongChart();chart.bars=[reviewedBar(fillReviewedRests([{instrument:'China',step:7,duration:6,kind:'note',dynamic:2}],'China'))]
 const split=changeChartMeter(chart,'2/4');expect(isSongChart(split)).toBe(true)
 expect(split.bars[0].China![7]).toBe(2);expect(split.bars[1].China!.some(Boolean)).toBe(false)
 const right=split.bars[1].rhythmEvents!.filter(event=>event.kind==='note');expect(right.map(event=>event.duration)).toEqual([4,1]);expect(right.every(event=>event.tieFromPrevious)).toBe(true)
 const joined=changeChartMeter(split,'4/4');expect(isSongChart(joined)).toBe(true);expect(joined.bars[0].China).toEqual(chart.bars[0].China)
 expect(isSongChart(importMusicXml(exportReviewedMusicXml(split.bars)))).toBe(true)
})
it('preserves existing ties across splits and fills an absent voice when joining reviewed halves',()=>{
 const chart=setBoundaryTie(pair(),1,'Ride',true);const joined=changeChartMeter(chart,'4/4');expect(joined.bars[0].rhythmEvents!.find(event=>event.step===8)?.tieFromPrevious).toBe(true)
 expect(isSongChart(changeChartMeter(joined,'2/4'))).toBe(true)
 const mixed=pair();mixed.bars[1]=reviewedBar(fillReviewedRests([{instrument:'Snare',step:0,duration:4,kind:'note',dynamic:2}],'Snare',8),8)
 expect(isSongChart(changeChartMeter(mixed,'4/4'))).toBe(true)
})
it('detaches orphan boundary ties after preceding-grid edits or deletion, making the onset audible',()=>{
 const chart=setBoundaryTie(pair(),1,'Ride',true)
 const edited=detachOrphanBoundaryTies(cycleChartNote(chart,0,'Snare',0));expect(isSongChart(edited)).toBe(true);expect(edited.bars[1].Ride![0]).toBe(2)
 const deleted=detachOrphanBoundaryTies({...chart,bars:chart.bars.slice(1)});expect(isSongChart(deleted)).toBe(true);expect(deleted.bars[0].Ride![0]).toBe(2)
 expect(()=>setBoundaryTie(pair(),0,'Ride',true)).toThrow('adjacent')
})
it('renders incoming and outgoing barline ties visibly on their respective staffs',()=>{
 const chart=setBoundaryTie(pair(),1,'Ride',true)
 render(<><ChartStaffNotation bar={chart.bars[0]} nextBar={chart.bars[1]} barNumber={1} activeStep={-1}/><ChartStaffNotation bar={chart.bars[1]} barNumber={2} activeStep={-1}/></>)
 expect(screen.getByLabelText('Tie to next bar')).toBeInTheDocument();expect(screen.getByLabelText('Tie from previous bar')).toBeInTheDocument()
})
it('rejects final dangling tie starts and ties interrupted by a rest in MusicXML',()=>{
 const chart=setBoundaryTie(pair(),1,'Ride',true);const xml=exportReviewedMusicXml(chart.bars)
 expect(()=>importMusicXml(xml.replace(/<measure number="2">[\s\S]*?<\/measure>/,''))).toThrow('following')
 const invalid=xml.replace('<tie type="stop"/>','');expect(()=>importMusicXml(invalid)).toThrow('broken tie')
})
it('retains a tie spanning multiple bar boundaries',()=>{
 const chart=pair();chart.bars[1]=reviewedBar([{instrument:'Ride',step:0,duration:4,kind:'note',dynamic:2},{instrument:'Ride',step:4,duration:4,kind:'note',dynamic:2,tieFromPrevious:true}],8)
 chart.bars.push(reviewedBar(fillReviewedRests([{instrument:'Ride',step:0,duration:4,kind:'note',dynamic:2}],'Ride',8),8))
 const first=setBoundaryTie(chart,1,'Ride',true),second=setBoundaryTie(first,2,'Ride',true)
 const imported=importMusicXml(exportReviewedMusicXml(second.bars));expect(isSongChart(imported)).toBe(true);expect(imported.bars[1].Ride!.some(Boolean)).toBe(false);expect(imported.bars[2].Ride![0]).toBe(0)
})
it('turns tied heads into strikes when duration metadata is discarded for grid editing',()=>{
 const chart=setBoundaryTie(pair(),1,'Ride',true)
 const edited=cycleChartNote(chart,1,'Snare',1)
 expect(edited.bars[1].rhythmEvents).toBeUndefined();expect(edited.bars[1].Ride![0]).toBe(2)
 expect(isSongChart(edited)).toBe(true)
})
it('requires renewed boundary review after bar deletion changes an otherwise valid predecessor',async()=>{
 const {chartHistoryReducer}=await import('./useChartHistory')
 const original=pair();original.bars.splice(1,0,structuredClone(original.bars[0]))
 const tied=setBoundaryTie(original,2,'Ride',true)
 const edited={...tied,bars:[tied.bars[0],tied.bars[2]]}
 const next=chartHistoryReducer({present:tied,past:[],future:[]},{type:'edit',update:edited}).present
 expect(next.bars[1].Ride![0]).toBe(2);expect(next.bars[1].rhythmEvents!.find(event=>event.step===0)?.tieFromPrevious).toBe(false)
 expect(isSongChart(next)).toBe(true)
})
it('retains reviewed rest-only voices between sounding bars during XML round trips',()=>{
 const chart=pair();chart.bars.splice(1,0,reviewedBar([{instrument:'Ride',step:0,duration:4,kind:'rest',dynamic:2},{instrument:'Ride',step:4,duration:4,kind:'rest',dynamic:2}],8))
 const imported=importMusicXml(exportReviewedMusicXml(chart.bars));expect(imported.bars[1].rhythmEvents).toHaveLength(2);expect(imported.bars[1].rhythmEvents!.every(event=>event.kind==='rest')).toBe(true)
})
