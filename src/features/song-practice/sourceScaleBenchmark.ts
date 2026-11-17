import { inspectNoteValue } from './noteValueHints'
import { hasCircledCymbalHead } from './circledCymbalHint'
import type { RecognitionImage,StaffCandidate } from './notationRecognition'
export interface ScaleSource {source:string;dpi:number;width:number;height:number;ink:readonly number[];staff:StaffCandidate;cases:readonly {x:number;y:number;value:string;symbol:string;identity:string}[]}
/** Benchmark known head coordinates; identity and automatic head detection are separate claims. */
export function benchmarkSourceScales(fixtures:readonly ScaleSource[]) {
 return fixtures.map(fixture=>{
  const ink=new Uint8Array(fixture.width*fixture.height);for(const index of fixture.ink)ink[index]=1
  const image:RecognitionImage={width:fixture.width,height:fixture.height,ink,angle:0,staffs:[fixture.staff]}
  const cases=fixture.cases.map((reference,id)=>{
   const hint=inspectNoteValue(image,fixture.staff,{id,x:reference.x,y:reference.y,instrument:'Hi-hat',shape:'cross',strength:1,stemHint:true,flagHint:false})
   const circled=hasCircledCymbalHead(image,fixture.staff,reference.x,reference.y)
   return {reference,detectedValue:hint.value,beamBands:hint.beamBands,flagBands:hint.flagBands,circled,durationCorrect:hint.value===reference.value,symbolCorrect:circled===(reference.symbol==='circled-cross')}
  })
  return {source:fixture.source,dpi:fixture.dpi,width:fixture.width,height:fixture.height,cases,summary:{references:cases.length,durationsCorrect:cases.filter(value=>value.durationCorrect).length,symbolsCorrect:cases.filter(value=>value.symbolCorrect).length}}
 })
}
