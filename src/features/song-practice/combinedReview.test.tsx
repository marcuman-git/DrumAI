import { expect, it } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { exportReviewedMusicXml } from './musicXmlExport'
import { importMusicXml } from './musicXmlImport'
import { reviewedBar, checkReviewedRhythm } from './reviewedRhythm'
import type { RhythmEvent } from './rhythmTypes'
import { isSongChart, newSongChart } from './songChartLogic'
import { sourceFingerprint, restoreSourceReview } from './sourceReviewSession'
import { identityDraftIssues, setIdentityReview } from './cymbalIdentityReview'
import type { NoteCandidate } from './notationRecognition'
import extra from './realExtraCymbalFixture'
import { ReviewedNotationPanel } from './ReviewedNotationPanel'
import { ChartStaffNotation } from './ChartStaffNotation'
const events:RhythmEvent[]=[{instrument:'China',step:0,duration:3,kind:'note',dynamic:3},{instrument:'China',step:3,duration:1,kind:'note',dynamic:2,tieFromPrevious:true},{instrument:'China',step:4,duration:4,kind:'rest',dynamic:2}]
it('preserves dotted durations and ties through XML and chart JSON without replaying continuations',()=>{
 const bar=reviewedBar(events,8);expect(bar.China![3]).toBe(0)
 const xml=exportReviewedMusicXml([bar],'<Reviewed & title>')
 expect(xml).toContain('<dot/>');expect(xml).toContain('<tie type="stop"/>')
 const chart=importMusicXml(xml);expect(chart.bars[0].rhythmEvents).toEqual(events)
 expect(chart.bars[0].China![0]).toBe(3);expect(chart.bars[0].China![3]).toBe(0);expect(isSongChart(JSON.parse(JSON.stringify(chart)))).toBe(true)
})
it('rejects orphan ties, rest ties, gaps and grid-only exports',()=>{
 expect(checkReviewedRhythm(events.map((event,index)=>index===0?{...event,tieFromPrevious:true}:event),8).valid).toBe(false)
 expect(checkReviewedRhythm(events.map((event,index)=>index===2?{...event,tieFromPrevious:true}:event),8).valid).toBe(false)
 expect(()=>exportReviewedMusicXml([newSongChart().bars[0]])).toThrow('reviewed')
 expect(()=>reviewedBar(events.slice(0,2),8)).toThrow()
})
it('round trips separate China Splash and Ride bell voices in multi-voice reviewed XML',()=>{
 const all:RhythmEvent[]=extra.flatMap(reference=>[{instrument:reference.instrument,step:0,duration:6,kind:'note',dynamic:2},{instrument:reference.instrument,step:6,duration:2,kind:'rest',dynamic:2}])
 const chart=importMusicXml(exportReviewedMusicXml([reviewedBar(all,8)]))
 for(const reference of extra)expect(chart.bars[0][reference.instrument]![0]).toBe(2)
 expect(chart.bars[0].rhythmEvents).toHaveLength(6)
})
it('requires manual identity verification for the three labelled key-source identities',()=>{
 for(const reference of extra){
  expect(reference.ink.some(index=>Math.abs(index%reference.width-reference.x)<10&&Math.abs(Math.floor(index/reference.width)-reference.y)<10)).toBe(true)
  const note={id:0,x:reference.x,y:reference.y,instrument:reference.instrument,shape:reference.symbol==='diamond'?'oval':'cross'} as NoteCandidate
  expect(identityDraftIssues([note])).toHaveLength(1)
  expect(identityDraftIssues(setIdentityReview([note],0,'verified'))).toEqual([])
 }
})
it('restores matching-source edits while clearing identity verification and rejects other crops or settings',()=>{
 const current=[{id:0,x:10,y:20,shape:'cross',instrument:'Crash'} as NoteCandidate]
 const pixels=new Uint8ClampedArray([0,1,2,255]);const key=sourceFingerprint(pixels,1,1,'score',1)
 const saved=JSON.stringify({version:1,sourceKey:key,scanKey:'scan',legend:'China circle per key',notes:setIdentityReview([{...current[0],instrument:'China'}],0,'verified'),accepted:[0],hints:{},events})
 const restored=restoreSourceReview(saved,key,'scan',current,8)
 expect(restored.notes[0].instrument).toBe('China');expect(restored.notes[0].identityReview).toBeUndefined();expect(restored.events).toEqual(events)
 expect(()=>restoreSourceReview(saved,sourceFingerprint(new Uint8ClampedArray([3,1,2,255]),1,1,'score',1),'scan',current,8)).toThrow('differ')
 expect(()=>restoreSourceReview(saved,key,'changed',current,8)).toThrow('differ')
})
it('renders dotted heads and a tie continuation without a second playback strike',()=>{
 render(<ChartStaffNotation bar={reviewedBar(events,8)} barNumber={1} activeStep={-1} />)
 expect(screen.getByLabelText('Tied continuation')).toBeInTheDocument()
 expect(screen.getByTestId('staff-China-0')).toHaveAttribute('aria-label','China slot 1: dotted eighth note')
})
it('offers MusicXML export only after reviewed-rhythm source confirmation',()=>{
 render(<ReviewedNotationPanel initialEvents={events} notes={[]} hints={{}} first={0} last={100} image={null} staff={null} slots={8} onConfirm={()=>{}} />)
 expect(screen.getByRole('button',{name:'Export confirmed bar MusicXML'})).toBeDisabled()
 fireEvent.click(screen.getByLabelText('I verified every onset, duration, rest and instrument against the source.'))
 expect(screen.getByRole('button',{name:'Export confirmed bar MusicXML'})).toBeEnabled()
 fireEvent.click(screen.getByLabelText('Event 2 tie continuation'))
 expect(screen.getByRole('button',{name:'Export confirmed bar MusicXML'})).toBeDisabled()
})
it('checks the clean lower score system ring evidence without inventing cymbal identity',async()=>{
 const {default:source}=await import('./realLowerScoreFixture'); const {hasCircledCymbalHead}=await import('./circledCymbalHint')
 const ink=new Uint8Array(source.width*source.height);for(const index of source.ink)ink[index]=1
 const image={width:source.width,height:source.height,ink,angle:0,staffs:[]}
 expect(hasCircledCymbalHead(image,source.staff,source.symbols[0].x,source.symbols[0].y)).toBe(true)
 expect(hasCircledCymbalHead(image,source.staff,source.symbols[1].x,source.symbols[1].y)).toBe(false)
 const {inspectNoteValue}=await import('./noteValueHints')
 for(const reference of source.durations){const note={id:0,x:reference.x,y:reference.y,instrument:'Snare',shape:'oval'} as NoteCandidate;expect(inspectNoteValue(image,source.staff,note).value).toBe(reference.value)}
 expect(source.symbols[0].identity).toContain('withheld')
})

it('restores unfinished overflow edits for correction while confirmation stays blocked',()=>{
 const current=[{id:0,x:10,y:20,shape:'cross',instrument:'Crash'} as NoteCandidate]
 const overflow:RhythmEvent[]=[{instrument:'Crash',step:7,duration:6,kind:'note',dynamic:2}]
 const saved=JSON.stringify({version:1,sourceKey:'source',scanKey:'scan',legend:'',notes:current,accepted:[0],hints:{},events:overflow})
 expect(restoreSourceReview(saved,'source','scan',current,8).events).toEqual(overflow)
 expect(checkReviewedRhythm(overflow,8).valid).toBe(false)
})
