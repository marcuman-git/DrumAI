import {expect,it} from 'vitest'
import intro from './realIntroGrooveFixtures'
import {findNoteCandidates} from './notationRecognition'
import {inspectRhythmContext} from './rhythmContext'
import {fillReviewedRests,reviewedBar} from './reviewedRhythm'
import type {RhythmEvent} from './rhythmTypes'
import {attachSourceAnchors} from './sourceTrace'
import {restoreSourceReview} from './sourceReviewSession'
import {createChartFromDraft} from './chartDraftWorkflow'
import {parseSongChart} from './songChartLogic'
import {setBoundaryTie,chartPlaybackNote} from './chartTieReview'
import {changeChartMeter} from './chartMeter'
import {chartTimingSummary} from './chartWorkflowSummary'
it('takes real source heads through deliberate correction, session recovery, chart/ties, meter and JSON',()=>{
 const f=intro.find(f=>f.dpi===144)!,ink=new Uint8Array(f.width*f.height),stemInk=new Uint8Array(f.width*f.height);for(const i of f.ink)ink[i]=1;for(const i of f.stemInk)stemInk[i]=1
 const image={width:f.width,height:f.height,ink,stemInk,angle:0,staffs:[f.staff]},detected=findNoteCandidates(image,f.staff,'generic',{cleanHeads:true,denseHeads:true,tolerance:2}),hints=inspectRhythmContext(image,f.staff,detected)
 expect(detected).toHaveLength(12)
 const selected=f.cases.map(ref=>detected.find(n=>n.shape===ref.shape&&Math.abs(n.x-ref.x)<=f.staff.gap*.65&&Math.abs(n.y-ref.y)<=f.staff.gap*.9)!)
 // This simulates explicit user mapping/onset correction; identities are not inferred from the fixture.
 let events:RhythmEvent[]=selected.map((note,index)=>({sourceCandidateId:note.id,instrument:index<8?'Hi-hat':index===8||index===10?'Kick':'Snare',step:index<8?index*2:[0,4,10,12][index-8],duration:2,kind:'note',dynamic:2}))
 for(const voice of ['Hi-hat','Snare','Kick'] as const)events=fillReviewedRests(events,voice,16)
 const session={version:1,sourceKey:'same-source',scanKey:'same-scan',legend:'Manual source interpretation in this test',notes:detected,accepted:selected.map(n=>n.id),hints,events}
 const restored=restoreSourceReview(JSON.stringify(session),'same-source','same-scan',detected,16)
 expect(restored.events).toEqual(events);expect(restored.notes.every(n=>n.identityReview===undefined)).toBe(true)
 const crop={page:1,region:{x:140/1190,y:320/1684,width:340/1190,height:120/1684}},bar=attachSourceAnchors(reviewedBar(restored.events,16),restored.events,selected,image,crop)
 let chart=createChartFromDraft({bar,bars:[bar,structuredClone(bar)],source:'Feel Good Inc.pdf',page:1,references:[[crop],[crop]]})
 chart=setBoundaryTie(chart,1,'Hi-hat',true);expect(chartPlaybackNote(chart.bars[1],'Hi-hat',0)).toBe(0);expect(chartPlaybackNote(chart.bars[1],'Hi-hat',0,true)).toBe(2)
 const split=changeChartMeter(chart,'2/4'),joined=changeChartMeter(split,'4/4');const loaded=parseSongChart(JSON.stringify({app:'DrumMaster AI Chart',schema:1,chart:joined}))
 expect(chartTimingSummary(loaded).seconds).toBe(8);expect(loaded.review?.bars[0].crops).toEqual([crop]);expect(loaded.bars[0].rhythmEvents?.some(e=>e.sourceAnchor?.page===1)).toBe(true)
})
