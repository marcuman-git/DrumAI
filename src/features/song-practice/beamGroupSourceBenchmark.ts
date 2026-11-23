import type {ScaleSource} from './sourceScaleBenchmark'
import {inspectRhythmContext} from './rhythmContext'
import {beamReviewGroups} from './beamGroupReview'
import type {NoteCandidate} from './notationRecognition'
type BeamSource=Omit<ScaleSource,'cases'>&{cases:readonly (ScaleSource['cases'][number]&{beamGroup:number})[];sharedPairs:readonly (readonly [number,number])[]}
export function benchmarkBeamGroups(fixtures:readonly BeamSource[]){return fixtures.map(f=>{
 const ink=new Uint8Array(f.width*f.height),stemInk=new Uint8Array(f.width*f.height);for(const i of f.ink)ink[i]=1;for(const i of f.stemInk??[])stemInk[i]=1
 const notes:NoteCandidate[]=f.cases.map((c,id)=>({id,x:c.x,y:c.y,instrument:c.shape==='cross'?'Hi-hat':'Snare',shape:c.shape??'oval',strength:1,stemHint:true,flagHint:false})),hints=inspectRhythmContext({width:f.width,height:f.height,ink,stemInk,angle:0,staffs:[f.staff]},f.staff,notes),groups=beamReviewGroups(notes,hints)
 const cases=f.cases.map((reference,id)=>({reference,detectedValue:hints[id].value,durationCorrect:hints[id].value===reference.value,linked:!!groups.find(g=>g.ids.includes(id)),crossGroupLinks:[...(hints[id].contextNeighbours??[]),...(hints[id].sharedStemNeighbours??[])].filter(peer=>f.cases[peer].beamGroup!==reference.beamGroup)}))
 const pairs=f.sharedPairs.map(([a,b])=>({a,b,linked:hints[a].sharedStemNeighbours?.includes(b)&&hints[b].sharedStemNeighbours?.includes(a)}))
 return {source:f.source,dpi:f.dpi,groups,cases,pairs,summary:{references:cases.length,durationsCorrect:cases.filter(c=>c.durationCorrect).length,linked:cases.filter(c=>c.linked).length,crossGroupLinks:cases.reduce((sum,c)=>sum+c.crossGroupLinks.length,0),sharedPairs:pairs.length,sharedPairsLinked:pairs.filter(p=>p.linked).length}}
})}
