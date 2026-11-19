import {findNoteCandidates} from './notationRecognition'
import type {ScaleSource} from './sourceScaleBenchmark'
/** Visually labelled cross-head recovery; instrument identity remains unverified. */
export function benchmarkSourceHeads(fixtures:readonly ScaleSource[]){return fixtures.map(f=>{
 const ink=new Uint8Array(f.width*f.height);for(const index of f.ink)ink[index]=1
 const notes=findNoteCandidates({width:f.width,height:f.height,ink,angle:0,staffs:[f.staff]},f.staff,'generic',{cleanHeads:true,tolerance:2}).filter(n=>n.shape==='cross')
 const available=new Set(notes.map(n=>n.id));const cases=f.cases.map(reference=>{const note=notes.filter(n=>available.has(n.id)&&Math.abs(n.x-reference.x)<=f.staff.gap*0.65&&Math.abs(n.y-reference.y)<=f.staff.gap*0.9).sort((a,b)=>Math.abs(a.x-reference.x)-Math.abs(b.x-reference.x))[0];if(note)available.delete(note.id);return {reference,detected:note??null,recovered:!!note}})
 return {source:f.source,dpi:f.dpi,cases,summary:{references:cases.length,recovered:cases.filter(c=>c.recovered).length,crossCandidates:notes.length,unmatched:available.size}}
 })}
