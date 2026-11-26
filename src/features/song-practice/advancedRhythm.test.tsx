import {expect,it} from 'vitest'
import {render,cleanup} from '@testing-library/react'
import {reviewedBar,checkReviewedRhythm} from './reviewedRhythm'
import {exportReviewedMusicXml} from './musicXmlExport'
import {importMusicXml} from './musicXmlImport'
import {chartScheduledHits} from './chartScheduledHits'
import {changeChartMeter} from './chartMeter'
import {newSongChart,isSongChart} from './songChartLogic'
import {ChartStaffNotation} from './ChartStaffNotation'
import {diagnoseReviewedRhythm} from './reviewedRhythmDiagnostics'
import type {RhythmEvent} from './rhythmTypes'
const notes=(duration:number,instrument:RhythmEvent['instrument']='Snare'):RhythmEvent[]=>Array.from({length:Math.round(16/duration)},(_,i)=>({instrument,step:i*duration,duration,kind:'note',dynamic:2}))
it('round trips fine timing, multiple voices, grace groups and articulations',()=>{
 const events=[...notes(.5),...notes(4/3,'Hi-hat')];events[0]={...events[0],grace:2,articulation:'rimshot',dynamic:3}
 const bar=reviewedBar(events),xml=exportReviewedMusicXml([bar]);const imported=importMusicXml(xml)
 const order=(events:RhythmEvent[])=>events.map(e=>({...e,step:Math.round(e.step*12),duration:Math.round(e.duration*12)})).sort((a,b)=>a.instrument.localeCompare(b.instrument)||a.step-b.step);expect(order(imported.bars[0].rhythmEvents!)).toEqual(order(bar.rhythmEvents!))
 expect(chartScheduledHits(imported.bars[0],'Snare',0)).toHaveLength(2)
 expect(chartScheduledHits(imported.bars[0],'Snare',0)[1].offset).toBe(.5)
 expect(xml.match(/<notations>/g)).toHaveLength(1)
})
it('preserves fractional notes, references and ties across meter conversion',()=>{
 const chart={...newSongChart(),bars:[reviewedBar(notes(4/3))]};const split=changeChartMeter(chart,'2/4'),joined=changeChartMeter(split,'4/4')
 expect(isSongChart(split)).toBe(true);expect(isSongChart(joined)).toBe(true)
 expect(joined.bars[0].rhythmEvents?.filter(e=>e.kind==='note'&&!e.tieFromPrevious)).toHaveLength(12)
})
it('renders fine flags, hollow long heads and grace review metadata',()=>{
 const bar=reviewedBar([{instrument:'Snare',step:0,duration:8,kind:'note',dynamic:2,grace:1,articulation:'cross-stick'},{instrument:'Snare',step:8,duration:8,kind:'rest',dynamic:2}])
 const {container}=render(<ChartStaffNotation bar={bar} barNumber={1} activeStep={-1}/>);expect(container.querySelector('ellipse[fill="none"]')).not.toBeNull();expect(container.textContent).toContain('cross-stick');cleanup()
})
it('diagnoses fine gaps without rounding away missing time and supports full-song charts',()=>{
 const events=notes(.5).slice(1);expect(checkReviewedRhythm(events).missing).toBe(.5);expect(diagnoseReviewedRhythm(events)[0].gaps[0].endExclusive).toBe(.5)
 expect(isSongChart({...newSongChart(),bars:Array.from({length:256},()=>reviewedBar(notes(4)))})).toBe(true)
 expect(isSongChart({...newSongChart(),bars:Array.from({length:257},()=>reviewedBar(notes(4)))})).toBe(false)
})
it('expands ordinary repeats and first/second endings in playback order',()=>{
 const measure=(repeat:string)=>`<measure><note><rest/><duration>16</duration></note>${repeat}</measure>`
 const xml=`<score-partwise><part-list/><part><measure><attributes><divisions>4</divisions><time><beats>4</beats><beat-type>4</beat-type></time></attributes><note><rest/><duration>16</duration></note><barline><repeat direction="forward"/></barline></measure>${measure('<barline><ending number="1" type="start"/><ending number="1" type="stop"/><repeat direction="backward"/></barline>')}${measure('<barline><ending number="2" type="start"/><ending number="2" type="stop"/></barline>')}</part></score-partwise>`
 expect(importMusicXml(xml).bars).toHaveLength(4)
})
