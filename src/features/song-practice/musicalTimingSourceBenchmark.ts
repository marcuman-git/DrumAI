import {staffRestNotation} from './staffRestNotation'
import back from './realBackFullTimingFixtures'
import intro from './realIntroGrooveFixtures'
import mixed from './realMixedGrooveFixtures'
import verse from './realVerseBeamFixtures'
import {benchmarkDenseHeads} from './denseHeadBenchmark'
import {inspectRhythmContext} from './rhythmContext'
import {resolveMusicalTiming} from './musicalTiming'
import type {ScaleSource} from './sourceScaleBenchmark'
import type {NoteCandidate,RecognitionImage} from './notationRecognition'
const labels={back:{onsets:[0,2,4,6,8,10,12,14],values:[2,2,2,2,2,2,2,2]},intro:{onsets:[0,2,4,6,8,10,12,14],values:[2,2,2,2,2,2,2,2]},mixed:{onsets:[0,4,6,10,12],values:[4,2,2,2,4]},verse:{onsets:[0,2,4,6,8,10,12,13,14],values:[2,2,2,2,2,2,1,1,2]}}
/** Whole-bar timing labels visually checked on original rendered score crops. Identity mapping is a manual benchmark input. */
export function benchmarkMusicalTimingSources(){return ([['back',back],['intro',intro],['mixed',mixed],['verse',verse]] as const).flatMap(([name,fixtures])=>fixtures.map(f=>{
 const fixture=f as ScaleSource,scan=benchmarkDenseHeads([fixture],true)[0],ink=new Uint8Array(f.width*f.height);for(const i of f.ink)ink[i]=1;const stemInk=fixture.stemInk?new Uint8Array(f.width*f.height):undefined;if(stemInk)for(const i of fixture.stemInk!)stemInk[i]=1
 const image:RecognitionImage={width:f.width,height:f.height,ink,stemInk,angle:0,staffs:[f.staff]}
 const rowYs=[...new Set(f.cases.map(c=>c.y))].sort((a,b)=>a-b),instrument=(reference:ScaleSource['cases'][number]):NoteCandidate['instrument']=>reference.shape==='oval'?reference.y===rowYs.at(-1)?'Kick':'Snare':'Hi-hat'
 const selected=scan.cases.flatMap(c=>c.detected?[{...c.detected,instrument:instrument(c.reference)}]:[]),hints=inspectRhythmContext(image,f.staff,selected)
 const sortedXs=[...new Set(f.cases.map(c=>c.x))].sort((a,b)=>a-b),columns:number[][]=[];for(const x of sortedXs){const last=columns.at(-1);if(last&&x-last[0]<=f.staff.gap*.4)last.push(x);else columns.push([x])}
 const expected=scan.cases.map(c=>{const i=columns.findIndex(xs=>xs.includes(c.reference.x));return {id:c.detected?.id,step:labels[name].onsets[i],duration:labels[name].values[i],instrument:instrument(c.reference)}})
 const existing=name==='mixed'?[{instrument:'Hi-hat' as const,step:8,duration:2,kind:'rest' as const,dynamic:2 as const}]:[]
 const result=resolveMusicalTiming(selected,hints,{slots:16,gap:f.staff.gap,existing})
 const proposal=result.proposals[0],renderedRests=staffRestNotation(proposal?.events??[],16,['Hi-hat','Snare','Kick']),correct=expected.filter(r=>proposal?.events.some(e=>e.kind==='note'&&e.sourceCandidateId===r.id&&e.step===r.step&&e.duration===r.duration)).length
 return {source:f.source,dpi:f.dpi,scope:'Detected head positions matched to checked source labels; manual row identities and a reviewed eighth rest at slot9 for the mixed bar. No head coordinates substituted; unmatched detections remain reported.',renderedRests,status:result.status,issues:result.issues,hints,expected,proposed:proposal?.events??[],summary:{references:expected.length,headsRecovered:scan.summary.recovered,unmatchedDetections:scan.summary.unmatched,correctTiming:correct,complete:result.status==='resolved'&&correct===expected.length}}
 }))}
