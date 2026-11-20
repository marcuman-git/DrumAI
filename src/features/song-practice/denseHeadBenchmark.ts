import {findNoteCandidates} from './notationRecognition'
import type {ScaleSource} from './sourceScaleBenchmark'
export function benchmarkDenseHeads(fixtures:readonly ScaleSource[],denseHeads=false){return fixtures.map(f=>{
 const ink=new Uint8Array(f.width*f.height);for(const i of f.ink)ink[i]=1
 const notes=findNoteCandidates({width:f.width,height:f.height,ink,angle:0,staffs:[f.staff]},f.staff,'generic',{cleanHeads:true,tolerance:2,denseHeads})
 const remaining=new Set(notes.map(n=>n.id));const cases=f.cases.map(reference=>{const match=notes.filter(n=>remaining.has(n.id)&&n.shape===(reference.shape??'cross')&&Math.abs(n.x-reference.x)<=f.staff.gap*.65&&Math.abs(n.y-reference.y)<=f.staff.gap*.9).sort((a,b)=>Math.hypot(a.x-reference.x,a.y-reference.y)-Math.hypot(b.x-reference.x,b.y-reference.y))[0];if(match)remaining.delete(match.id);return {reference,recovered:!!match,detected:match??null}})
 return {source:f.source,dpi:f.dpi,denseHeads,cases,unmatched:notes.filter(n=>remaining.has(n.id)),summary:{references:cases.length,recovered:cases.filter(c=>c.recovered).length,unmatched:remaining.size,candidates:notes.length}}
})}
