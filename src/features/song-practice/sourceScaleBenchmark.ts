import { inspectNoteValue } from './noteValueHints'
import { hasCircledCymbalHead } from './circledCymbalHint'
import type { RecognitionImage,StaffCandidate } from './notationRecognition'
export interface ScaleSource {source:string;publisher?:string;dpi:number;width:number;height:number;ink:readonly number[];stemInk?:readonly number[];staff:StaffCandidate;cases:readonly {x:number;y:number;value:string;symbol:string;identity:string;shape?:'cross'|'oval';evidence?:'beam'|'flag'|'none'}[]}
/** Benchmark known head coordinates; identity and automatic head detection are separate claims. */
export function benchmarkSourceScales(fixtures:readonly ScaleSource[]) {
 return fixtures.map(fixture=>{
  const ink=new Uint8Array(fixture.width*fixture.height);for(const index of fixture.ink)ink[index]=1
  const stemInk=fixture.stemInk?new Uint8Array(fixture.width*fixture.height):undefined;if(stemInk)for(const index of fixture.stemInk!)stemInk[index]=1
  const image:RecognitionImage={width:fixture.width,height:fixture.height,ink,stemInk,angle:0,staffs:[fixture.staff]}
  const cases=fixture.cases.map((reference,id)=>{
   const hint=inspectNoteValue(image,fixture.staff,{id,x:reference.x,y:reference.y,instrument:reference.shape==='oval'?'Snare':'Hi-hat',shape:reference.shape??'cross',strength:1,stemHint:true,flagHint:false})
   const circled=hasCircledCymbalHead(image,fixture.staff,reference.x,reference.y)
   return {reference,detectedValue:hint.value,beamBands:hint.beamBands,flagBands:hint.flagBands,circled,evidence:hint.evidence,evidenceCorrect:reference.evidence===undefined||hint.evidence===reference.evidence,durationCorrect:hint.value===reference.value,symbolCorrect:circled===(reference.symbol==='circled-cross')}
  })
  return {source:fixture.source,publisher:fixture.publisher,dpi:fixture.dpi,width:fixture.width,height:fixture.height,cases,summary:{references:cases.length,durationsCorrect:cases.filter(value=>value.durationCorrect).length,evidenceCorrect:cases.filter(value=>value.evidenceCorrect).length,symbolsCorrect:cases.filter(value=>value.symbolCorrect).length}}
 })
}
